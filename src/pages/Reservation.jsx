import { useLocation } from "react-router-dom";
import styled from "styled-components";
import UserHeader from "../components/Header/UserHeader";

const Container = styled.div`
  width: 200%;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const DoubleInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const InfoBlock = styled.div`
  display: flex;
  justify-content: left;
  width: 50%;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 30px;
`;

const FileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileUploadButton = styled.button`
  background: #444;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${(props) => (props.primary ? "#1d2951" : "#555")};
  color: white;
`;

const Reservation = () => {
  const location = useLocation();
  const { date, startTime, endTime } = location.state || {};
  return (
    <>
      <UserHeader />
      <Container>
        <Title>강의실 대여 신청</Title>
        <InfoContainer>
          <InfoRow>
            <Label>신청 강의실</Label>
            <span>103호</span>
          </InfoRow>
          <DoubleInfoRow>
            <InfoBlock>
              <Label>신청 날짜</Label>
              <span>{date}</span>
            </InfoBlock>
            <InfoBlock>
              <Label>신청 시간</Label>
              <span>
                {Math.floor(startTime)}:{startTime % 1 === 0.5 ? "30" : "00"}
                부터 {Math.floor(endTime)}:{endTime % 1 === 0.5 ? "30" : "00"}
                까지
              </span>
            </InfoBlock>
          </DoubleInfoRow>
          <DoubleInfoRow>
            <InfoBlock>
              <Label>성명</Label>
              <span>000</span>
            </InfoBlock>
            <InfoBlock>
              <Label>전화번호</Label>
              <span>010-0000-0000</span>
            </InfoBlock>
          </DoubleInfoRow>

          <FileSection>
            <Label>첨부파일</Label>
            <span>강의실대여_신청서.pdf 강의실대여_신청서.hwp</span>
            <FileUploadButton>파일 업로드</FileUploadButton>
          </FileSection>
        </InfoContainer>
        <ButtonContainer>
          <Button>목록</Button>
          <Button primary>신청</Button>
        </ButtonContainer>
      </Container>
    </>
  );
};

export default Reservation;

// const Reservation = () => {
//   const location = useLocation();
//   const { date, startTime, endTime } = location.state || {};

//   return (
//     <div>
//       <UserHeader />
//       <h2>강의실 대여 신청</h2>
//       <hr />
//       {date ? (
//         <p>
//           날짜: {date} <br />
//           시간: {Math.floor(startTime)}:{startTime % 1 === 0.5 ? "30" : "00"} -{" "}
//           {Math.floor(endTime)}:{endTime % 1 === 0.5 ? "30" : "00"}
//         </p>
//       ) : (
//         <p>예약 정보가 없습니다.</p>
//       )}
//     </div>
//   );
// };

// export default Reservation;

// const PageWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh; /* 뷰포트 전체 높이를 차지 */
//   width: 100vw; /* 뷰포트 전체 너비를 차지 */
//   margin-top: 20px;
// `;
