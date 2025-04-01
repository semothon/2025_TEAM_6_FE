import { useParams } from "react-router-dom";
import UserHeader from "../components/Header/UserHeader";
import classroom103 from "../assets/images/classroom_103.png";
import classroom136 from "../assets/images/classroom_136.png";
import classroom220 from "../assets/images/classroom_220.png";
import classroom226 from "../assets/images/classroom_226.png";
import classroom445 from "../assets/images/classroom_445.png";
import classroom539 from "../assets/images/classroom_539.png";

const classrooms = {
  4: [
    { id: 103, seats: 60, image: classroom103 },
    { id: 136, seats: 62, image: classroom136 },
    { id: 220, seats: 75, image: classroom220 },
    { id: 226, seats: 78, image: classroom226 },
    { id: 445, seats: 56, image: classroom445 },
    { id: 539, seats: 47, image: classroom539 },
  ],
};

const ClassroomDetail = () => {
  const { collegeId, classroomId } = useParams();
  const collegeClassrooms = classrooms[collegeId] || [];
  const classroom = collegeClassrooms.find(
    (room) => room.id.toString() === classroomId
  );

  if (!classroom) return <p>강의실 정보를 찾을 수 없습니다.</p>;

  return (
    <>
      <UserHeader />
      <div style={{ padding: "24px" }}>
        <h2>
          {collegeId} 대학 - {classroom.id}호
        </h2>
        <img
          src={classroom.image}
          alt={`${classroom.id}호`}
          style={{ width: "100%", maxWidth: "600px", borderRadius: "8px" }}
        />
        <p>최대 인원: {classroom.seats}명</p>
      </div>
    </>
  );
};

export default ClassroomDetail;
