import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import backgroundImage from "../assets/images/loginBackground.png";
import loginImage from "../assets/images/loginPle.png";
import { UserContext } from "../context/userContext";

// 로그인 페이지에서 로그인이 되어 있지 않은 상태에서
// 다른 페이지들을 들어가면 어떻게 되나요 ex. 강의실 안내 외 alert?
// 로그인을 하기 전에는 사용자인지 관리자인지 모르는데
// 헤더는 어떻게 할까요?
// info21 통합 ID 로그인 가능?

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeButton, setActiveButton] = useState("USER");

  // context에서 로그인 정보 받아오기
  const { setUserData } = useContext(UserContext);

  const handleLoginDetail = async (e) => {
    e.preventDefault();

    try {
      // API 요청: userId와 activeButton(사용자/관리자)을 쿼리 파라미터로 전달
      const response = await axios.get(
        `https://itsmeweb.store/api/user?userId=${userId}&userRole=${activeButton}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result.result === "SUCCESS") {
        const userDataFromResponse = result.data;
        // Context에 userData 저장
        setUserData(userDataFromResponse);
        setMessage(`${userDataFromResponse.userName}님 환영합니다!`);

        console.log(userDataFromResponse);
        // localStorage에 저장장
        // API 응답에는 토큰이 없으므로 사용자 정보만 저장합니다.
        localStorage.setItem("user", JSON.stringify(userDataFromResponse));
        // console.log(localStorage.getItem("user"));
        localStorage.setItem("role", userDataFromResponse.userRole);

        // 역할에 따라 페이지 이동 (navigate 시 state도 함께 전달 가능)
        if (activeButton === "USER") {
          navigate("/home", { state: { userData: userDataFromResponse } });
        } else if (activeButton === "ADMIN") {
          navigate("/admin/home", {
            state: { userData: userDataFromResponse },
          });
        }
      } else {
        const errorMessage =
          result.error?.message || "로그인에 실패했습니다. 다시 확인해주세요.";
        setMessage(errorMessage);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setMessage(error.response.data.error.message);
      } else {
        setMessage("로그인 요청 중 오류가 발생했습니다.");
      }
      console.error("로그인 오류:", error);
    }
  };

  return (
    <>
      <Header role="USER" />
      <PageWrapper>
        <Container>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <img
              src={loginImage}
              alt="로그인"
              style={{ width: "50px", marginRight: "10px" }}
            />
            <div style={{ fontSize: "16px", textAlign: "left" }}>
              경희대학교 강의실 대여 서비스에 오신걸 환영합니다.
              <br />
              로그인을 하시면 더 많은 강의실 대여 서비스를 이용하실 수 있습니다.
            </div>
          </div>

          <hr />
          <ButtonGroup>
            <StyledButton
              active={activeButton === "USER"}
              onClick={() => setActiveButton("USER")}
            >
              사용자 로그인
            </StyledButton>
            <StyledButton
              active={activeButton === "ADMIN"}
              onClick={() => setActiveButton("ADMIN")}
            >
              관리자 로그인
            </StyledButton>
          </ButtonGroup>
          <LoginForm onSubmit={handleLoginDetail}>
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
            <LoginButton type="submit">로그인</LoginButton>
          </LoginForm>

          <Options>
            <label>
              <input type="checkbox" /> 로그인 유지
            </label>
            <Links>
              <a href="#">아이디 찾기</a> | <a href="#">비밀번호 찾기</a> |{" "}
              <a href="#">회원가입</a>
            </Links>
          </Options>

          <Notice>
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

// 이미지는 헤더 높이를 포함해서 가운데 배치해야함
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 뷰포트 전체 높이를 차지지 */
  width: 100vw; /* 뷰포트 전체 너비를 차지 */
  background-image: url(${backgroundImage});
  background-size: cover;
`;

const Container = styled.div`
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 50px;
  border-radius: 15px;
  max-width: 1000px;
  margin-top: 80px; /* Container는 헤더 제외 높이에서 가운데 위치치 */
  text-align: center;
  background-color: #fff;
`;

const StyledButton = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 18px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")}
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

const LoginForm = styled.form`
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
  padding: 12px;
  font-size: 12px;
  border: 1px solid rgb(216, 216, 216);
  border-radius: 5px;
  width: 400px;

  &::placeholder {
    font-size: 13px;
    color: #bababa;
  }
`;

const LoginButton = styled.button`
  padding: 32px 40px;
  font-size: 16px;
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
