import React, { useState, useMemo, useEffect } from "react";
import styled, { css } from "styled-components";

import { useParams } from "react-router-dom";
import { useDebounce } from "react-use";

import { useParsedAmount } from "hooks/useParsedAmount";
import { usePnkData } from "hooks/usePNKData";
import { commify, uncommify } from "utils/commify";
import { formatPNK, roundNumberDown } from "utils/format";
import { isUndefined } from "utils/index";

import { landscapeStyle } from "styles/landscapeStyle";

import { NumberInputField } from "components/NumberInputField";

import StakeWithdrawButton, { ActionType } from "./StakeWithdrawButton";

const StyledField = styled(NumberInputField)`
  height: fit-content;
  input {
    border-radius: 3px 0px 0px 3px;
  }
`;

const LabelArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryBlue};
  cursor: pointer;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const InputFieldAndButton = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const EnsureChainContainer = styled.div`
  button {
    height: 45px;
    border: 1px solid ${({ theme }) => theme.stroke};
    border-radius: 0px 3px 3px 0px;
  }
`;

interface IInputDisplay {
  action: ActionType;
  amount: string;
  setAmount: (arg0: string) => void;
}

const InputDisplay: React.FC<IInputDisplay> = ({ action, amount, setAmount }) => {
  const [debouncedAmount, setDebouncedAmount] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  useDebounce(() => setDebouncedAmount(amount), 500, [amount]);
  const parsedAmount = useParsedAmount(uncommify(debouncedAmount) as `${number}`);

  const { id } = useParams();
  const { balance, jurorBalance } = usePnkData({ courtId: id });

  const parsedBalance = formatPNK(balance ?? 0n, 0, true);

  const parsedStake = formatPNK(jurorBalance?.[2] ?? 0n, 0, true);
  const isStaking = useMemo(() => action === ActionType.stake, [action]);

  useEffect(() => {
    if (parsedAmount > 0n && balance === 0n && isStaking) {
      setErrorMsg("You need a non-zero PNK balance to stake");
    } else if (isStaking && balance && parsedAmount > balance) {
      setErrorMsg("Insufficient balance to stake this amount");
    } else if (!isStaking && jurorBalance && parsedAmount > jurorBalance[2]) {
      setErrorMsg("Insufficient staked amount to withdraw this amount");
    } else {
      setErrorMsg(undefined);
    }
  }, [parsedAmount, isStaking, balance, jurorBalance]);

  return (
    <>
      <LabelArea>
        <label>{`Available ${isStaking ? parsedBalance : parsedStake} PNK`}</label>
        <StyledLabel
          onClick={() => {
            const amount = isStaking ? parsedBalance : parsedStake;
            setAmount(amount);
          }}
        >
          {isStaking ? "Stake" : "Withdraw"} all
        </StyledLabel>
      </LabelArea>
      <InputArea>
        <InputFieldAndButton>
          <StyledField
            value={uncommify(amount)}
            onChange={(e) => {
              setAmount(e);
            }}
            placeholder={isStaking ? "Amount to stake" : "Amount to withdraw"}
            message={errorMsg ?? undefined}
            variant={!isUndefined(errorMsg) ? "error" : "info"}
            formatter={(number: string) => (number !== "" ? commify(roundNumberDown(Number(number))) : "")}
          />
          <EnsureChainContainer>
            <StakeWithdrawButton
              {...{
                amount,
                parsedAmount,
                action,
                setAmount,
                setErrorMsg,
              }}
            />
          </EnsureChainContainer>
        </InputFieldAndButton>
      </InputArea>
    </>
  );
};

export default InputDisplay;
