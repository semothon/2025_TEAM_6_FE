import DocumentTable from "../components/DocumentTable";
import UserHeader from "../components/Header/UserHeader";
import styled from "styled-components";

const Report = () => {
  const requestData = [
    { room: "220호", date: "2025.03.26", message: "선택" },
    { room: "226호", date: "2025.03.28", message: "선택" },
    { room: "445호", date: "2025.04.02", message: "선택" },
  ];
  return (
    <>
      <UserHeader />
      <PageWrapper>
        <ContentWrapper>
          <Title>신청 내역</Title>

          <DocumentTable data={requestData} />
        </ContentWrapper>
      </PageWrapper>
    </>
  );
};

export default Report;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  margin-top: 80px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
  width: 1200px; /* DocumentTable과 동일한 너비 */
`;

const Title = styled.h3`
  margin-bottom: 10px; /* 테이블과의 간격 조정 */
`;
