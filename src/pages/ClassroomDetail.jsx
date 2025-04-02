import { useLocation } from "react-router-dom";
import UserHeader from "../components/Header/UserHeader";
import pleImage from "../assets/images/maxple.png";
import styled from "styled-components";

const ClassroomDetail = () => {
  const location = useLocation();
  const { college, classroom } = location.state || {};

  if (!classroom || !college) return <p>강의실 정보를 찾을 수 없습니다.</p>;

  return (
    <>
      <UserHeader />
      <Leftside>
        <img
          src={classroom.image}
          alt={`${classroom.id}호`}
          style={{
            width: "750px",
            height: "450px",
            borderRadius: "8px",
            marginTop: "60px",
            objectFit: "cover",
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <h2>
            {classroom.id}호 | {college.name}
          </h2>
          <img
            src={pleImage}
            alt="인원"
            style={{ width: "15px", marginLeft: "10px" }}
          />
          <p style={{ fontSize: "12px", marginLeft: "5px" }}>
            정원 최대 {classroom.seats}명
          </p>
        </div>

        <div>
          <h2>유의사항</h2>
          <div style={{ fontSize: "12px", color: "#626262" }}>
            <li>사용 후 반드시 정리정돈 (의자, 책상, 컴퓨터)</li>
            <li>
              현수막 부착 시에 사용되는 양면테이프, 끈끈이, 풀 등 강의실이
              오염되는 물질 사용 금지
            </li>
            <li>
              확인 후 이행되지 않을 시 추후 강의실 대여가 제한될 수 있습니다.
            </li>
            <li>주말 및 공휴일은 대여 불가</li>
          </div>
        </div>
      </Leftside>
      <Buttons>
        <ListButton>목록</ListButton>
        <ApplyButton>대여 신청</ApplyButton>
      </Buttons>
    </>
  );
};

export default ClassroomDetail;

const Leftside = styled.div`
  padding: 24px;
  margin-left: 30px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: right;
  margin-bottom: 10px;
`;

const ListButton = styled.button`
  color: #fff;
  background-color: #4f4f4f;
  border-radius: 5px;
  font-size: 12px;
  width: 110px;
  height: 35px;
`;

const ApplyButton = styled.button`
  color: #fff;
  background-color: #263a73;
  border-radius: 5px;
  font-size: 12px;
  width: 110px;
  height: 35px;
  margin-left: 10px;
`;
