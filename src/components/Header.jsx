import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import khu from "../assets/images/KHU.png";
import kyunghee from "../assets/images/KYUNGHEEUNIV.png";

// 모든 페이지에 있을 헤더
const Header = ({ role }) => {
  const navigate = useNavigate();

  return (
    <>
      <MainFrame>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={khu}
            alt="경희대학교"
            style={{ width: "70px", marginLeft: "20px", marginRight: "15px" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // 중앙 정렬 보장
              gap: "2px", // 간격 최소화
            }}
          >
            <p
              style={{
                fontSize: "26px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              경희대학교 강의실 대여
            </p>
            <img
              src={kyunghee}
              alt="KyungHeeUniv"
              style={{
                height: "30px",
                marginTop: "-15px",
                marginBottom: "20px",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <MilestoneContainer>
            <Milestone onClick={() => navigate("/home")}>강의실 안내</Milestone>
            {role === "USER" ? (
              <Milestone onClick={() => navigate("/report")}>
                결과보고서 작성
              </Milestone>
            ) : (
              ""
            )}
            <Milestone onClick={() => navigate("/document")}>
              문서보관함
            </Milestone>
          </MilestoneContainer>
          <ButtonContainer>
            <Button>로그인</Button>
            <Button>ENG</Button>
          </ButtonContainer>
        </div>
      </MainFrame>
    </>
  );
};

export default Header;

const MainFrame = styled.header`
  position: fixed;
  width: 100%;
  top: 0;
  height: 100px;
  background-color: #9d1c1f;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000; /* 헤더가 다른 요소들 보다 가장 위에 표시하기 위함 */
`;

const MilestoneContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 60px;
`;

const Milestone = styled.div`
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 40px;
  height: 100%; /* 높이를 header에 맞추거나 */
  padding: 10px 0; /* 텍스트 위아래 여백 확보 */
`;

const ButtonContainer = styled.div`
  margin-right: 20px;
`;

const Button = styled.button`
  border: none;
  outline: none; /* 클릭 시 경계선 제거 */
  font-size: 15px;
  padding: 10px 25px 10px 25px;
  margin-right: 20px;
  background-color: #820f12;
  color: #fff;
  border-radius: 20px;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.2);
`;
