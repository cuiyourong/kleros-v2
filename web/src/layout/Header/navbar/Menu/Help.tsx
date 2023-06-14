import React, { useRef } from "react";
import styled from "styled-components";
import { useFocusOutside } from "hooks/useFocusOutside";
import Book from "svgs/icons/book-open.svg";
import Guide from "svgs/icons/book.svg";
import Bug from "svgs/icons/bug.svg";
import ETH from "svgs/icons/eth.svg";
import Faq from "svgs/menu-icons/help.svg";
import Telegram from "svgs/socialmedia/telegram.svg";

const ITEMS = [
  {
    text: "Onboarding",
    Icon: Book,
    url: "",
  },
  {
    text: "Get Help",
    Icon: Telegram,
    url: "",
  },
  {
    text: "Report a Bug",
    Icon: Bug,
    url: "",
  },
  {
    text: "DApp Guide",
    Icon: Guide,
    url: "",
  },
  {
    text: "Crypto Beginner's Guide",
    Icon: ETH,
    url: "",
  },
  {
    text: "FAQ",
    Icon: Faq,
    url: "",
  },
];

interface IHelp {
  toggle: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translate(-50%);
  z-index: 10;
  padding: 27px 10px;
  gap: 23px;
  border: 1px solid ${({ theme }) => theme.stroke};
  background-color: ${({ theme }) => theme.whiteBackground};
  border-radius: 3px;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.06);
`;

const ListItem = styled.div`
  display: flex;
  gap: 8px;
  padding: 0px 8px;
  cursor: pointer;
  :hover {
    transform: scale(1.02) translateZ(0);
    transition: 200ms;
    transition-timing-function: cubic-bezier(0.3, 0, 0.2, 1);
    backface-visibility: hidden;
  }

  small {
    font-size: 16px;
    font-weight: 400;
  }
`;
const Icon = styled.svg`
  display: inline-block;
  width: 16px;
  height: 16px;
  fill: ${({ theme }) => theme.secondaryPurple};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.blackLowOpacity};
  z-index: 1;
`;

const Help: React.FC<IHelp> = ({ toggle }) => {
  const containerRef = useRef(null);
  useFocusOutside(containerRef, () => {
    toggle();
  });

  return (
    <>
      <Overlay />
      <Container ref={containerRef}>
        {ITEMS.map((item) => (
          <ListItem key={item.text}>
            <Icon as={item.Icon} />
            <small>{item.text}</small>
          </ListItem>
        ))}
      </Container>
    </>
  );
};
export default Help;