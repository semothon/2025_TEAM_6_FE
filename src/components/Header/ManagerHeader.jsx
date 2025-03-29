import styled from "styled-components";

// 모든 페이지에 있을 헤더
const ManagerHeader = () => {
  // 반응형으로 변경해야함
  return (
    <>
      <MainFrame>
        <div style={{ marginLeft: "20px" }}>경희대학교 강의실 대여</div>
        <div style={{ display: "flex" }}>
          <Milestone>강의실 안내</Milestone>
          <Milestone>알림</Milestone>
          <Milestone>문서보관함</Milestone>
          <Milestone>OOO님</Milestone>
          <Logout>로그아웃</Logout>
        </div>
      </MainFrame>
    </>
  );
};

export default ManagerHeader;

const MainFrame = styled.header`
  position: fixed;
  width: 100%;
  top: 0;
  height: 60px;
  background-color: #9d1c1f;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  /* 헤더가 다른 요소들 보다 가장 위에 표시하기 위함 */
`;

const Milestone = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 50px;
`;

const Logout = styled.button`
  border: none;
  outline: none; /* 클릭 시 경계선 제거 */
  font-size: 12px;
  padding: 10px 12px 10px 12px;
  margin-right: 20px;
  background-color: #820f12;
  color: #fff;
`;
