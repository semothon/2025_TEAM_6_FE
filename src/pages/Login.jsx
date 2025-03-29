import LoginHeader from "../components/Header/LoginHeader";

// 로그인 페이지에서 로그인이 되어 있지 않은 상태에서
// 다른 페이지들을 들어가면 어떻게 되나요 ex. 강의실 안내 외 alert?
// 로그인을 하기 전에는 사용자인지 관리자인지 모르는데
// 헤더는 어떻게 할까요?

const Login = () => {
  return (
    <>
      <LoginHeader />
      <div>아직 로그인 안됨!</div>
    </>
  );
};

export default Login;
