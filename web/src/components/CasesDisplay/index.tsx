import React from "react";
import styled from "styled-components";
import Search from "./Search";
import StatsAndFilters from "./StatsAndFilters";
import CasesGrid, { ICasesGrid } from "./CasesGrid";
import { responsiveSize } from "styles/responsiveSize";
import LightButton from "../LightButton";
import ArrowIcon from "assets/svgs/icons/arrow.svg";
import { useLocation, useNavigate } from "react-router-dom";

const Divider = styled.hr`
  display: flex;
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: ${responsiveSize(20, 24)};
`;
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: ${responsiveSize(32, 48)};
`;

const StyledTitle = styled.h1`
  margin: 0px;
`;

const StyledButton = styled(LightButton)`
  display: flex;
  flex-direction: row-reverse;
  gap: 8px;
  > .button-text {
    color: ${({ theme }) => theme.primaryBlue};
  }
  padding: 0px;
`;

interface ICasesDisplay extends ICasesGrid {
  numberDisputes?: number;
  numberClosedDisputes?: number;
  title?: string;
  className?: string;
}

const CasesDisplay: React.FC<ICasesDisplay> = ({
  disputes,
  currentPage,
  setCurrentPage,
  numberDisputes,
  numberClosedDisputes,
  casesPerPage,
  title = "Cases",
  className,
  totalPages,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div {...{ className }}>
      <TitleContainer className="title">
        <StyledTitle>{title}</StyledTitle>
        {location.pathname.startsWith("/cases/display/1/desc/all") ? (
          <StyledButton onClick={() => navigate(`/resolver`)} text="Create a case" Icon={ArrowIcon} />
        ) : null}
      </TitleContainer>
      <Search />
      <StatsAndFilters totalDisputes={numberDisputes ?? 0} closedDisputes={numberClosedDisputes ?? 0} />
      <Divider />

      {disputes?.length === 0 ? (
        <h1>No cases found</h1>
      ) : (
        <CasesGrid
          disputes={disputes}
          {...{
            casesPerPage,
            totalPages,
            currentPage,
            setCurrentPage,
          }}
        />
      )}
    </div>
  );
};

export default CasesDisplay;
