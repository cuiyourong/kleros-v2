import React from "react";
import styled from "styled-components";
import { useCasesQuery } from "queries/useCasesQuery";
import DisputeCard from "components/DisputeCard";
import { StyledSkeleton } from "components/StyledSkeleton";

const Container = styled.div`
  margin-top: 64px;
  .disputes-container {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const LatestCases: React.FC = () => {
  const { data } = useCasesQuery(0);
  return (
    <Container>
      <h1>Latest Cases</h1>
      <div className="disputes-container">
        {data
          ? data.disputes.map((dispute, i) => <DisputeCard key={i} {...dispute} />)
          : Array.from({ length: 3 }).map((_, index) => <StyledSkeleton key={index} width={312} height={260} />)}
      </div>
    </Container>
  );
};

export default LatestCases;
