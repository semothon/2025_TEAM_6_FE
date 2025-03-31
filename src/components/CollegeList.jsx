import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import classroom103 from "../assets/images/classroom_103.png";
import classroom136 from "../assets/images/classroom_136.png";
import classroom220 from "../assets/images/classroom_220.png";
import classroom226 from "../assets/images/classroom_226.png";
import classroom445 from "../assets/images/classroom_445.png";
import classroom539 from "../assets/images/classroom_539.png";

const colleges = [
  { id: 1, name: "공과대학관" },
  { id: 2, name: "전자정보대학관" },
  { id: 3, name: "응용과학대학관" },
  { id: 4, name: "소프트웨어융합대학관" },
  { id: 5, name: "생명과학대학관" },
  { id: 6, name: "국제대학관" },
  { id: 7, name: "외국어대학관" },
  { id: 8, name: "예술디자인대학관" },
  { id: 9, name: "체육대학관" },
  { id: 10, name: "국제경영대학관" },
];

const classrooms = {
  3: [{ id: 220, seats: 120 }],
  4: [
    { id: 103, seats: 60, image: classroom103 },
    { id: 136, seats: 62, image: classroom136 },
    { id: 220, seats: 75, image: classroom220 },
    { id: 226, seats: 78, image: classroom226 },
    { id: 445, seats: 56, image: classroom445 },
    { id: 539, seats: 47, image: classroom539 },
  ],
};

const CollegeList = () => {
  // @단과대 목록으로 할건지 대학관 목록으로 할건지 결정해야 함
  const [selectedCollege, setSelectedCollege] = useState(null);
  const navigate = useNavigate();

  /* id기반으로 된 단과대 이름을 표시하기 위함함 */
  const selectedCollegeObj = colleges.find(
    (college) => college.id === selectedCollege
  );

  return (
    <div style={{ display: "flex", height: "85vh" }}>
      {/* Sidebar */}
      <Sidebar>
        <h2
          style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}
        >
          단과대 목록
        </h2>
        <hr style={{ color: "#868686" }}></hr>
        {colleges.map((college) => (
          <CollegeButton
            key={college.id}
            active={selectedCollege === college.id}
            onClick={() => {
              setSelectedCollege(college.id);
            }}
          >
            {college.name}
          </CollegeButton>
        ))}
      </Sidebar>

      {/* Content */}
      <Content>
        {selectedCollege && classrooms[selectedCollege] ? (
          <>
            <ClassroomGrid>
              {classrooms[selectedCollege].map((room) => (
                <ClassroomCard
                  key={room.id}
                  onClick={() =>
                    navigate(`/home/${selectedCollege}-${room.id}`)
                  }
                >
                  <img
                    src={room.image}
                    alt={`${room.id}호`}
                    style={{
                      width: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {room.id}호 |{" "}
                    {selectedCollegeObj ? selectedCollegeObj.name : ""}{" "}
                  </p>
                  <p style={{ fontSize: "13px" }}>최대 {room.seats}명</p>
                </ClassroomCard>
              ))}
            </ClassroomGrid>
          </>
        ) : (
          <p style={{ color: "#6b7280" }}> 단과대를 선택해주세요 </p>
        )}
      </Content>
    </div>
  );
};

export default CollegeList;

const Sidebar = styled.div`
  width: 250px;
  background: #fff;
  padding: 16px;
  overflow-y: auto;
  height: 100vh;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
`;

const CollegeButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 8px;
  border: none;
  background: ${(props) => (props.active ? "#EFF2F6" : "#fff")};
  color: ${(props) => (props.active ? "#263A73" : "#868686")};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  cursor: pointer;
  border-radius: 4px;
  transition: 0.3s;

  &:hover {
    background: #eff2f6;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
`;

const ClassroomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const ClassroomCard = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const SelectedClassroom = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #e5e7eb;
  border-radius: 8px;
`;
