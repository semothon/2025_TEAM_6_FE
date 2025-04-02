import styled from "styled-components";
import checkIcon from "../assets/images/Check_circle.png";
import closeIcon from "../assets/images/close_btn.png";
import React from "react";

const RejectModal = ({ title = "반려 사유", onClose }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    console.log("반려 사유:", reason);
    onClose(); // 확인 누르면 닫힘
  };

  return (
    <PopupOverlay>
      <PopupBox>
        <CloseButton onClick={onClose}>
          <img src={closeIcon} alt="닫기" />
        </CloseButton>
        <TopSpace />
        <TopLine />
        <TopSpace />
        <TopSpace />

        <Title>{title}</Title>
        <TextAreaWrapper>
          <TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="반려 사유를 작성해주세요."
          />
        </TextAreaWrapper>

        <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
      </PopupBox>
    </PopupOverlay>
  );
};

export default RejectModal;

const TextAreaWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 120px;
  margin-top: 0rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: none;
  font-size: 14px;
  color: #333;
  background-color: #f9f9f9;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: #aaa;
  }
`;

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

const Title = styled.h2`
  font-size: 25px;
  margin-top: 0rem;
  font-weight: bold;
  color: #222;
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
