import UserHeader from "../components/Header/UserHeader";
import styled from "styled-components";
import DocumentTable from "../components/DocumentTable";
import DocumentTableCompleted from "../components/DocumentTableCompleted";

const Document = () => {
  const requestData = [
    { room: "539호", date: "2025.03.21", message: "승인 대기" },
    { room: "220호", date: "2025.03.26", message: "승인 대기" },
    { room: "226호", date: "2025.03.28", message: "승인 대기" },
    { room: "445호", date: "2025.04.02", message: "승인 대기" },
  ];

  return (
    <>
      <UserHeader />
      <PageWrapper>
        <div style={{ marginTop: "200px" }}>
          <h2 style={{ display: "flex", justifyContent: "center" }}>
            신청 내역 문서보관함
          </h2>
          <h3>진행중인 신청내역</h3>
          <DocumentTable data={requestData} />
          <br></br>
          <h3>완료된 신청 내역</h3>
          <DocumentTableCompleted />
          <br></br>
        </div>
      </PageWrapper>
    </>
  );
};

export default Document;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 뷰포트 전체 높이를 차지 */
  width: 100vw; /* 뷰포트 전체 너비를 차지 */
  margin-top: 20px;
`;
