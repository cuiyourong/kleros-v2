import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import { keccak256, encodePacked } from "viem";
import { useWalletClient, usePublicClient } from "wagmi";
import { prepareWriteDisputeKitClassic } from "hooks/contracts/generated";
import useSigningAccount from "hooks/useSigningAccount";
import { wrapWithToast } from "utils/wrapWithToast";
import { useDisputeDetailsQuery } from "queries/useDisputeDetailsQuery";
import OptionsContainer from "./OptionsContainer";
import { isUndefined } from "utils/index";

const Container = styled.div`
  width: 100%;
  height: auto;
`;

interface ICommit {
  arbitrable: `0x${string}`;
  voteIDs: string[];
  setIsOpen: (val: boolean) => void;
}

const Commit: React.FC<ICommit> = ({ arbitrable, voteIDs, setIsOpen }) => {
  const { id } = useParams();
  const parsedDisputeID = useMemo(() => BigInt(id ?? 0), [id]);
  const parsedVoteIDs = useMemo(() => voteIDs.map((voteID) => BigInt(voteID)), [voteIDs]);
  const { data: disputeData } = useDisputeDetailsQuery(id);
  const currentRoundIndex = disputeData?.dispute?.currentRoundIndex;
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { signingAccount, generateSigningAccount } = useSigningAccount();
  const saltKey = useMemo(
    () => `dispute-${id}-round-${currentRoundIndex}-voteids-${voteIDs}`,
    [id, currentRoundIndex, voteIDs]
  );
  const [_, setSalt] = useLocalStorage(saltKey);

  const handleCommit = useCallback(
    async (choice: number) => {
      const message = { message: saltKey };
      const salt = !isUndefined(signingAccount)
        ? signingAccount.signMessage(message)
        : await (async () => {
            const account = await generateSigningAccount();
            account!.signMessage(message);
          })();
      setSalt(JSON.stringify({ salt, choice }));
      const commit = keccak256(encodePacked([BigInt, String], [BigInt(choice), salt]));
      const { request } = await prepareWriteDisputeKitClassic({
        functionName: "castCommit",
        args: [parsedDisputeID, parsedVoteIDs, commit],
      });
      if (walletClient) {
        wrapWithToast(async () => await walletClient.writeContract(request), publicClient).then(() => {
          setIsOpen(true);
        });
      }
    },
    [
      saltKey,
      setSalt,
      parsedVoteIDs,
      parsedDisputeID,
      publicClient,
      setIsOpen,
      walletClient,
      generateSigningAccount,
      signingAccount,
    ]
  );

  return id ? (
    <Container>
      <OptionsContainer {...{ arbitrable, handleSelection: handleCommit }} />
    </Container>
  ) : null;
};

export default Commit;