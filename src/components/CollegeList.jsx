import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import pleImage from "../assets/images/maxple.png";

const colleges = [
  { id: 1, name: "공과대학관" },
  { id: 2, name: "전자정보대학관" },
  { id: 3, name: "응용과학대학관", value: "AppliedScience" },
  { id: 4, name: "소프트웨어융합대학관", value: "SoftwareConvergence" },
  { id: 5, name: "생명과학대학관" },
  { id: 6, name: "국제대학관" },
  { id: 7, name: "외국어대학관" },
  { id: 8, name: "예술디자인대학관" },
  { id: 9, name: "체육대학관" },
  { id: 10, name: "국제경영대학관" },
];

const CollegeList = () => {
  // @단과대 목록으로 할건지 대학관 목록으로 할건지 결정해야 함
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // const [filteredRooms, setFilteredRooms] = useState(classrooms);
  const [classroomList, setClassroomList] = useState([]);

  const handleSearch = () => {
    // 여기서 특정 시간에 대한 필터링 로직을 추가할 수 있음
    console.log(`검색 날짜: ${date}, 시작: ${startTime}, 종료: ${endTime}`);
  };

  /* id기반으로 된 단과대 이름을 표시하기 위함함 */
  const selectedCollegeObj = colleges.find(
    (college) => college.id === selectedCollege
  );

  const handleCollegeClick = async (college) => {
    setSelectedCollege(college.id);

    if (college.value) {
      try {
        const res = await axios.get(
          `https://itsmeweb.store/api/classroom?classroomBuilding=${college.value}`
        );
        if (res.data.result === "SUCCESS") {
          setClassroomList(res.data.data.roomPreviewInfos);
        } else {
          console.error("API 오류:", res.data.error?.message);
          setClassroomList([]);
        }
      } catch (err) {
        console.error("요청 실패:", err);
        setClassroomList([]);
      }
    } else {
      setClassroomList([]);
    }
  };

  return (
    // 헤더 제외 높이를 최대 높이라 간주주
    <div style={{ display: "flex", height: "calc(100vh - 200px)" }}>
      {/* Sidebar */}
      <Sidebar>
        <Title>단과대 목록</Title>
        <hr style={{ color: "#868686", width: "90%" }}></hr>
        {colleges.map((college) => (
          <CollegeButton
            key={college.id}
            active={selectedCollege === college.id}
            onClick={() => {
              handleCollegeClick(college);
            }}
          >
            {college.name}
          </CollegeButton>
        ))}
      </Sidebar>
      <Wrapper>
        {/* Content */}
        <Content>
          <FilterContainer>
            <Input
              type="date"
              value={date}
              placeholder={!date ? "날짜" : ""}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              type="time"
              value={startTime}
              min="18:00"
              max="22:00"
              step="1800"
              placeholder="시작 시간"
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              type="time"
              value={endTime}
              placeholder="종료 시간"
              onChange={(e) => setEndTime(e.target.value)}
            />
            <SearchButton onClick={handleSearch}>검색하기</SearchButton>
          </FilterContainer>
          {selectedCollege && classroomList.length > 0 ? (
            <>
              <ClassroomGrid>
                {classroomList.map((room) => (
                  <ClassroomCard
                    key={room.classroomId}
                    onClick={() => {
                      navigate(`/home/${selectedCollege}/${room.classroomId}`, {
                        state: {
                          college: colleges[selectedCollege - 1],
                          classroom: room,
                        },
                      });
                    }}
                  >
                    <img
                      src={room.classroomImage}
                      alt={`${room.classroomNumber}호`}
                      style={{
                        width: "375px",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "-8px",
                      }}
                    >
                      {room.classroomNumber}호 | {selectedCollegeObj?.name}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <img
                        src={pleImage}
                        alt="인원"
                        style={{
                          width: "13px",
                          height: "13px",
                          marginRight: "5px",
                        }}
                      />
                      <p style={{ fontSize: "13px" }}>
                        최대 {room.classroomCapacity}명
                      </p>
                    </div>
                  </ClassroomCard>
                ))}
              </ClassroomGrid>
            </>
          ) : (
            <p style={{ color: "#6b7280" }}> 단과대를 선택해주세요 </p>
          )}
        </Content>
      </Wrapper>
    </div>
  );
};

export default CollegeList;

const Sidebar = styled.div`
  width: 250px;
  background: #fff;
  padding: 16px 0 16px 0; // 좌우 padding 제거
  height: 100vh;
  overflow-y: auto;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  margin-left: 29px;
  margin-top: 10px;
`;

const CollegeButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 15px 16px 15px 30px; // 왼쪽 여백만 늘려서 텍스트 들여쓰기
  margin-bottom: 8px;
  border: none;
  background: ${(props) => (props.active ? "#EFF2F6" : "#fff")};
  color: ${(props) => (props.active ? "#263A73" : "#868686")};
  font-size: 18px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  cursor: pointer;
  border-right: ${(props) =>
    props.active ? "4px solid #263A73" : "4px solid transparent"};
  border-radius: 0;
  transition: 0.3s;

  &:hover {
    background: #eff2f6;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: -5px;
  margin-bottom: 18px;
  background-color: #f0f0f0;
  padding: 7px 3px 7px;
  border: 1px solid #a0a0a0;
  border-radius: 5px;
  width: 75vw;
`;

const Input = styled.input`
  padding: 8px;
  border: none;
  border-radius: 5px;
  width: 28%;
`;

const SearchButton = styled.button`
  padding: 8px 15px;
  border: none;
  background-color: #4f4f4f;
  color: white;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: rgb(98, 98, 98);
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
  display: flex;
  flex-direction: column;
  width: 90%;

  &:hover {
    color: #263a73;
    transition: 0.2s;
  }
`;

const Wrapper = styled.div`
  margin-left: 50px;
  margin-top: 10px;
`;
