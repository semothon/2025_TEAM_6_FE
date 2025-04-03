import DocumentTable from "../components/DocumentTable";
import UserHeader from "../components/Header/UserHeader";
import styled from "styled-components";

const Report = () => {
  return (
    <>
      <UserHeader />
      <PageWrapper>
        <h3>신청 내역</h3>

        <DocumentTable room="130호" date="2025.04.02" message="선택" />
      </PageWrapper>
    </>
  );
};

export default Report;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
