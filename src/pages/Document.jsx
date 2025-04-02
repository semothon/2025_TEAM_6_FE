import UserHeader from "../components/Header/UserHeader";
import styled from "styled-components";

const Document = () => {
  return (
    <>
      <UserHeader />
      <PageWrapper>
        <Center>
          <h2>신청 내역 문서보관함</h2>
          <h3>진행중인 신청내역</h3>
          <h3>완료된 신청 내역</h3>
        </Center>
      </PageWrapper>
    </>
  );
};

export default Document;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 뷰포트 전체 높이를 차지 */
  width: 100vw; /* 뷰포트 전체 너비를 차지 */
`;
