import styled from "styled-components";
import checkIcon from "../assets/images/Check_circle.png";
import closeIcon from "../assets/images/close_btn.png";
import React from "react";

const Modal = ({ title, message, onClose }) => {
  return (
    <PopupOverlay>
      <PopupBox>
        <CloseButton onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </CloseButton>
        <TopSpace />
        <TopLine />
        <Icon>
          {" "}
          <img src={checkIcon} alt="체크이미지" />
        </Icon>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </PopupBox>
    </PopupOverlay>
  );
};

export default Modal;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PopupBox = styled.div`
  width: 420px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  overflow: hidden;
`;
const TopSpace = styled.div`
  height: 10px;
`;
const TopLine = styled.div`
  height: 2px;
  background-color: #ddd;
  margin: 0 auto;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 10px;
  width: 30px;
  height: 24px;
  padding: 0;
  border: none;
  transition: all 0.2s ease; /* 부드러운 효과 전환 */
  background: none;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;
    /* 버튼 눌렀을 때 테두리 제거 */
  }
  &:active {
    outline: none;
    transform: translateY(1px);
  }
  &:hover {
    color: #666; /* 회색 좀 더 진하게 */
    transform: scale(1.2); /* 살짝 커짐 */
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: invert(1) brightness(0.7); /* ✅ 검정 → 밝은 회색 */
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  color: #666;
  margin-top: 2rem;
  img {
    width: 70px;
    height: 70px;
  }
`;

const Title = styled.h2`
  font-size: 25px;
  margin-top: 0rem;
  font-weight: bold;
  color: #222;
`;

const Message = styled.p`
  font-size: 14px;
  color: #333;
  margin-top: 0.5rem;
`;

const ConfirmButton = styled.button`
  margin-top: 2rem;
  background-color: rgb(13, 50, 111);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    transform: scale(1.1); /* 살짝 커짐 */
  }
`;
