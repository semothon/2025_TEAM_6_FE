import React, { useState } from 'react';
import styled from 'styled-components';
import LoginHeader from '../components/Header/LoginHeader';
import Popup, { Popup_reject } from '../components/Popup';

const Button = styled.button`
  margin: 10px;
  padding: 12px 24px;
  font-size: 16px;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const EmptyPage = () => {
  const [popupInfo, setPopupInfo] = useState(null);

  // 조건 분기
  let popupElement = null;

  if (popupInfo?.type === 'reject') {
    popupElement = <Popup_reject onClose={() => setPopupInfo(null)} />;
  } else if (popupInfo) {
    popupElement = (
      <Popup
        title={popupInfo.title}
        message={popupInfo.message}
        onClose={() => setPopupInfo(null)}
      />
    );
  }

  return (
    <>
      <LoginHeader />

      <Button
        onClick={() =>
          setPopupInfo({
            title: '신청 완료',
            message:
              '신청 내역은 문서 보관함의 내용 보기에서 보실 수 있습니다.',
          })
        }
      >
        신청 팝업
      </Button>

      <Button
        onClick={() =>
          setPopupInfo({
            title: '등록 완료',
            message: '등록 내역은 강의실 개별 안내화면에서 보실 수 있습니다.',
          })
        }
      >
        등록 팝업
      </Button>

      <Button
        onClick={() =>
          setPopupInfo({
            title: '승인 완료',
            message: '해당 내용을 승인하였습니다.',
          })
        }
      >
        승인 팝업
      </Button>

      <Button onClick={() => setPopupInfo({ type: 'reject' })}>
        반려 팝업
      </Button>

      {/* 팝업 표시 */}
      {popupElement}
    </>
  );
};

export default EmptyPage;
