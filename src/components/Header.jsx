import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import khu from "../assets/images/KHU.png";
import kyunghee from "../assets/images/KYUNGHEEUNIV.png";
import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../context/userContext";

// 모든 페이지에 있을 헤더
const Header = ({ role }) => {
  const navigate = useNavigate();
  // 로그인 정보 받아오기 -> Context로 전역으로 접근 및 사용 가능
  const { userData, setUserData } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 문서보관함을 눌렀을 때
  const dropdownRef = useRef(null); // 드롭다운 바깥 클릭 감지를 위한 ref 임.

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  // 문서보관함 외부 클릭 시 닫히게 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 로그인 또는 로그아웃
  const handleAuthClick = () => {
    if (userData) {
      // 로그아웃 처리: localStorage 초기화 및 Context 초기화
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setUserData(null);
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <MainFrame>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
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
            {/* 문서보관함 버튼 여기부터 */}
            <MilestoneWrapper ref={dropdownRef}>
              <Milestone onClick={handleDropdownToggle}>문서보관함</Milestone>
              {isDropdownOpen && (
                <DropdownMenu>
                  <DropdownItem onClick={() => handleMenuClick("/document")}>
                    신청내역
                  </DropdownItem>
                  <Divider />
                  <DropdownItem
                    onClick={() => handleMenuClick("/document/report")}
                  >
                    결과보고서 내역
                  </DropdownItem>
                </DropdownMenu>
              )}
            </MilestoneWrapper>
          </MilestoneContainer>
          <ButtonContainer>
            <Button onClick={handleAuthClick}>
              {userData ? "로그아웃" : "로그인"}
            </Button>{" "}
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

// 여기부터 밑에는 문서보관함 클릭시 나오는 박스 style

const MilestoneWrapper = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute; // 부모요소인 MilestoneWrapper를 기준으로 절대 위치 지정함.
  top: 100%; // 부모 요소의 아래쪽으로 붙어서 위치함.
  left: 20%; // 부모 요소의 아래쪽의 왼쪽 20% 위치부터 시작
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1001;
`;
const DropdownItem = styled.div`
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  color: black;
  width: 130px;
  &:hover {
    background-color: #f2f2f2;
  }
`;
const Divider = styled.div`
  // 신청내역, 결과보고서내역 사이의 줄
  height: 1px;
  background-color: #ddd;
  margin: 0 10px;
`;
