import React from "react";
import styled from "styled-components";
import { MAX_WIDTH_LANDSCAPE } from "styles/landscapeStyle";

import { Routes, Route } from "react-router-dom";

import { responsiveSize } from "styles/responsiveSize";

import AttachmentDisplay from "./AttachmentDisplay";
import CaseDetails from "./CaseDetails";
import CasesFetcher from "./CasesFetcher";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: ${responsiveSize(32, 80)} ${responsiveSize(24, 136)} ${responsiveSize(76, 96)};
  max-width: ${MAX_WIDTH_LANDSCAPE};
  margin: 0 auto;
`;

const Cases: React.FC = () => (
  <Container>
    <Routes>
      <Route path="/display/:page/:order/:filter" element={<CasesFetcher />} />
      <Route path="/:id/evidence/attachment/*" element={<AttachmentDisplay />} />
      <Route path="/:id/overview/policy/attachment/*" element={<AttachmentDisplay />} />
      <Route path="/:id/overview/attachment/*" element={<AttachmentDisplay />} />
      <Route path="/:id/*" element={<CaseDetails />} />
    </Routes>
  </Container>
);

export default Cases;
