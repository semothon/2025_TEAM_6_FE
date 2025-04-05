import CollegeList from "../components/CollegeList";
import Header from "../components/Header";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const Home = () => {
  const { userData } = useContext(UserContext);
  const userRole = userData.userRole;
  return (
    <>
      <Header role={userRole} />
      <CollegeList />
    </>
  );
};

export default Home;
