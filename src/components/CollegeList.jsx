import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import classroom103 from '../assets/images/classroom_103.png';
import classroom136 from '../assets/images/classroom_136.png';
import classroom220 from '../assets/images/classroom_220.png';
import classroom226 from '../assets/images/classroom_226.png';
import classroom445 from '../assets/images/classroom_445.png';
import classroom539 from '../assets/images/classroom_539.png';
import pleImage from '../assets/images/maxple.png';

const colleges = [
  { id: 1, name: '공과대학관' },
  { id: 2, name: '전자정보대학관' },
  { id: 3, name: '응용과학대학관' },
  { id: 4, name: '소프트웨어융합대학관' },
  { id: 5, name: '생명과학대학관' },
  { id: 6, name: '국제대학관' },
  { id: 7, name: '외국어대학관' },
  { id: 8, name: '예술디자인대학관' },
  { id: 9, name: '체육대학관' },
  { id: 10, name: '국제경영대학관' },
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
  const navigate = useNavigate();
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [filteredRooms, setFilteredRooms] = useState(classrooms);

  const handleSearch = () => {
    // 여기서 특정 시간에 대한 필터링 로직을 추가할 수 있음
    console.log(`검색 날짜: ${date}, 시작: ${startTime}, 종료: ${endTime}`);
    setFilteredRooms(classrooms); // 현재는 전체 리스트 그대로 반환
  };

  /* id기반으로 된 단과대 이름을 표시하기 위함함 */
  const selectedCollegeObj = colleges.find(
    (college) => college.id === selectedCollege
  );

  return (
    // 헤더 제외 높이를 최대 높이라 간주주
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      {/* Sidebar */}
      <Sidebar>
        <Title>단과대 목록</Title>
        <hr style={{ color: '#868686', width: '90%' }}></hr>
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
      <Wrapper>
        {/* Content */}
        <Content>
          <FilterContainer>
            <Input
              type="date"
              value={date}
              placeholder={!date ? '날짜' : ''}
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
          {selectedCollege && classrooms[selectedCollege] ? (
            <>
              <ClassroomGrid>
                {classrooms[selectedCollege].map((room) => (
                  <ClassroomCard
                    key={room.id}
                    onClick={() => {
                      navigate(`/home/${selectedCollege}/${room.id}`, {
                        state: {
                          college: colleges[selectedCollege - 1],
                          classroom: room,
                        },
                      });
                    }}
                  >
                    <img
                      src={room.image}
                      alt={`${room.id}호`}
                      style={{
                        width: '375px',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      {room.id}호 |{' '}
                      {selectedCollegeObj ? selectedCollegeObj.name : ''}{' '}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <img
                        src={pleImage}
                        alt="인원"
                        style={{
                          width: '13px',
                          height: '13px',
                          marginRight: '5px',
                        }}
                      />
                      <p style={{ fontSize: '13px' }}>최대 {room.seats}명</p>
                    </div>
                  </ClassroomCard>
                ))}
              </ClassroomGrid>
            </>
          ) : (
            <p style={{ color: '#6b7280' }}> 단과대를 선택해주세요 </p>
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
  background: ${(props) => (props.active ? '#EFF2F6' : '#fff')};
  color: ${(props) => (props.active ? '#263A73' : '#868686')};
  font-size: 18px;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;
  border-right: ${(props) =>
    props.active ? '4px solid #263A73' : '4px solid transparent'};
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
  margin-bottom: 20px;
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
