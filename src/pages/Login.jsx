import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dummyData from "../assets/dummy/login.json";
import UserHeader from "../components/Header/UserHeader";
import ManagerHeader from "../components/Header/ManagerHeader";
import backgroundImage from "../assets/images/loginBackground.png";
import loginImage from "../assets/images/loginPle.png";

// 로그인 페이지에서 로그인이 되어 있지 않은 상태에서
// 다른 페이지들을 들어가면 어떻게 되나요 ex. 강의실 안내 외 alert?
// 로그인을 하기 전에는 사용자인지 관리자인지 모르는데
// 헤더는 어떻게 할까요?
// info21 통합 ID 로그인 가능?

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [activeButton, setActiveButton] = useState("user");
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(dummyData)
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error loading JSON:", error));
  }, []);

  return (
    <>
      {activeButton === "user" ? <UserHeader /> : <ManagerHeader />}
      <PageWrapper>
        <Container>
          <div style={{ display: "flex" }}>
            <img
              src={loginImage}
              alt="로그인"
              style={{ width: "40px", marginRight: "10px" }}
            />
            <div style={{ fontSize: "13px", textAlign: "left" }}>
              경희대학교 강의실 대여 서비스에 오신걸 환영합니다.
              <br />
              로그인을 하시면 더 많은 강의실 대여 서비스를 이용하실 수 있습니다.
            </div>
          </div>

          <hr />
          <ButtonGroup>
            <StyledButton
              active={activeButton === "user"}
              onClick={() => setActiveButton("user")}
            >
              사용자 로그인
            </StyledButton>
            <StyledButton
              active={activeButton === "admin"}
              onClick={() => setActiveButton("admin")}
            >
              관리자 로그인
            </StyledButton>
          </ButtonGroup>
          <LoginForm>
            <InputGroup>
              <Input
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                required
              />
            </InputGroup>
            <LoginButton>로그인</LoginButton>
          </LoginForm>

          <Options>
            <label>
              <input type="checkbox" /> 아이디 저장
            </label>
            <Links>
              <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a> |{" "}
              <a href="#">로그인 안내</a>
            </Links>
          </Options>

          <Notice>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

            <strong>📢 로그인 안내</strong>
            <ul>
              <li>통합정보시스템 학번/직번 로그인</li>
              <li>초기 비밀번호: 주민번호 앞자리</li>
              <li>비밀번호 변경 후 로그인 가능</li>
              <li>DPWM 변경 후 접속 불가한 경우 학사팀에 문의</li>
            </ul>
          </Notice>
        </Container>
      </PageWrapper>
    </>
  );
};

export default Login;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 뷰포트 전체 높이를 차지 */
  width: 100vw; /* 뷰포트 전체 너비를 차지 */
  background-image: url(${backgroundImage});
  background-size: cover;
`;

const Container = styled.div`
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  max-width: 1000px;
  margin: 20px auto;
  text-align: center;
  background-color: #fff;
`;

const StyledButton = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  border: 2px solid #263a73;
  background-color: ${(props) => (props.active ? "#263a73" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#263a73")};
  transition: 0.3s;
  &:first-child {
    margin-right: 5px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  margin-top: 15px;
`;

const LoginForm = styled.div`
  display: flex;
  align-items: center; /* 입력 필드와 로그인 버튼을 수직 정렬 */
  gap: 10px; /* 입력 필드와 버튼 사이 간격 */
  justify-content: center; /* 가운데 정렬 */
  margin-top: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 400px;

  &::placeholder {
    font-size: 13px;
  }
`;

const LoginButton = styled.button`
  padding: 32px 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  border: 2px solid #263a73;
  background-color: #263a73;
  color: #fff;
  transition: 0.3s;
  &:hover {
    background-color: #1e2f5c;
  }
`;

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #555;
`;

const Links = styled.div`
  a {
    color: #263a73;
    text-decoration: none;
    margin: 0 5px;
  }
`;

const Notice = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 12px;
  text-align: left;
  color: #555;

  ul {
    padding-left: 15px;
  }
  li {
    margin-bottom: 5px;
  }
`;
