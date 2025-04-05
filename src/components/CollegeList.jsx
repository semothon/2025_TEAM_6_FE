import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import pleImage from '../assets/images/maxple.png';
import dateIcon from '../assets/images/date_icon.png';
import starttimeIcon from '../assets/images/starttime_icon.png';

// 날짜, 시작시간, 끝시간 라이브러리
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createGlobalStyle } from 'styled-components';

const colleges = [
  { id: 1, name: '공과대학관' },
  { id: 2, name: '전자정보대학관' },
  { id: 3, name: '응용과학대학관', value: 'AppliedScience' },
  { id: 4, name: '소프트웨어융합대학관', value: 'SoftwareConvergence' },
  { id: 5, name: '생명과학대학관' },
  { id: 6, name: '국제대학관' },
  { id: 7, name: '외국어대학관' },
  { id: 8, name: '예술디자인대학관' },
  { id: 9, name: '체육대학관' },
  { id: 10, name: '국제경영대학관' },
];

const CollegeList = () => {
  // @단과대 목록으로 할건지 대학관 목록으로 할건지 결정해야 함
  const navigate = useNavigate();
  // 페이지 화면 시작을 "소프트웨어융합대학"으로 설정
  const defaultCollege = colleges.find(
    (college) => college.value === 'SoftwareConvergence'
  );
  const [selectedCollege, setSelectedCollege] = useState(
    defaultCollege?.id || null
  );
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  // 선택가능한 시간대 리스트 생성(30분 간격)
  const includedTimes = [18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22].map(
    (t) => {
      const date = new Date();
      date.setHours(Math.floor(t), (t % 1) * 60, 0, 0);
      return date;
    }
  );
  // const [filteredRooms, setFilteredRooms] = useState(classrooms);
  const [classroomList, setClassroomList] = useState([]);
  // 검색 여부 상태
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (defaultCollege) {
      handleCollegeClick(defaultCollege);
    }
  }, []);

  const handleSearch = async () => {
    if (!date || !startTime || !endTime) {
      alert('날짜와 시간을 모두 선택해주세요.');
      return;
    }

    // 날짜 형식: YYYY-MM-DD
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // 시간 형식: HH:mm:ss
    const formatTime = (time) => {
      const hour = time.getHours().toString().padStart(2, '0');
      const minute = time.getMinutes().toString().padStart(2, '0');
      return `${hour}:${minute}:00`;
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    try {
      const response = await axios.get(
        'https://itsmeweb.store/api/classroom/available',
        {
          params: {
            date: formattedDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          },
          headers: {
            accept: 'application/json',
          },
        }
      );

      if (response.data.roomPreviewInfos) {
        setClassroomList(response.data.roomPreviewInfos);
        setIsSearching(true);
      } else {
        setClassroomList([]);
        setIsSearching(true);
      }
    } catch (err) {
      console.error('예약 가능 강의실 조회 실패:', err);
      setClassroomList([]);
      setIsSearching(true);
    }
  };

  /* id기반으로 된 단과대 이름을 표시하기 위함 */
  const selectedCollegeObj = colleges.find(
    (college) => college.id === selectedCollege
  );

  const handleCollegeClick = async (college) => {
    setSelectedCollege(college.id);
    setIsSearching(false);

    // 👉 입력값 초기화
    setDate(null);
    setStartTime(null);
    setEndTime(null);

    if (college.value) {
      try {
        const res = await axios.get(
          `https://itsmeweb.store/api/classroom?classroomBuilding=${college.value}`
        );
        if (res.data.result === 'SUCCESS') {
          setClassroomList(res.data.data.roomPreviewInfos);
        } else {
          console.error('API 오류:', res.data.error?.message);
          setClassroomList([]);
        }
      } catch (err) {
        console.error('요청 실패:', err);
        setClassroomList([]);
      }
    } else {
      setClassroomList([]);
    }
  };

  // console.log("classroomList", classroomList);

  return (
    // 헤더 제외 높이를 최대 높이라 간주
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      {/* Sidebar */}
      <Sidebar>
        <Title>단과대 목록</Title>
        <hr style={{ color: '#868686', width: '90%' }}></hr>
        {colleges.map((college) => (
          <CollegeButton
            key={college.id}
            $active={selectedCollege === college.id}
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
            <Container>
              <DatePickerFix /> {/* 전역 스타일 삽입 */}
              <Picker
                selected={date}
                onChange={setDate}
                dateFormat="yyyy-MM-dd"
                placeholderText="날짜"
                popperPlacement="bottom-start" // 왼쪽 정렬로 설정
              />
              <TimePicker
                selected={startTime}
                onChange={setStartTime}
                showTimeSelect
                showTimeSelectOnly
                // timeIntervals={30}
                timeCaption=""
                dateFormat="HH:mm"
                placeholderText="시작 시간"
                popperPlacement="bottom-start" // 왼쪽 정렬로 설정
                scrollToTime={(() => {
                  const d = new Date();
                  d.setHours(19, 0, 0, 0);
                  return d;
                })()}
                includeTimes={includedTimes} // 선택가능한 시간대 조정
              />
              <TimePicker
                selected={endTime}
                onChange={setEndTime}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption=""
                dateFormat="HH:mm"
                placeholderText="종료 시간"
                popperPlacement="bottom-start" // 왼쪽 정렬로 설정
                includeTimes={includedTimes} // 선택가능한 시간대 조정
              />
            </Container>
            <SearchButton onClick={handleSearch}>검색하기</SearchButton>
          </FilterContainer>
          {classroomList.length > 0 ? (
            <>
              <ClassroomGrid>
                {classroomList.map((room) => (
                  <ClassroomCard
                    key={room.classroomId}
                    onClick={() => {
                      navigate(`/home/${selectedCollege}/${room.classroomId}`, {
                        state: {
                          collegeName: selectedCollegeObj?.name || '검색결과',
                          classroomInfo: {
                            id: room.classroomId,
                            image: room.classroomImage,
                            number: room.classroomNumber,
                            capacity: room.classroomCapacity,
                          },
                        },
                      });
                    }}
                  >
                    <img
                      src={room.classroomImage}
                      alt={`${room.classroomNumber}호`}
                      style={{
                        width: '345px',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    <p
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '-8px',
                      }}
                    >
                      {room.classroomNumber}호{' '}
                      {selectedCollegeObj?.name
                        ? `| ${selectedCollegeObj.name}`
                        : ''}
                    </p>
                    <div
                      style={{
                        paddingTop: '6px',
                        display: 'flex',
                        alignItems: 'baseline',
                        height: '26px',
                      }}
                    >
                      <img
                        src={pleImage}
                        alt="인원"
                        style={{
                          width: '13px',
                          height: '13px',
                          marginRight: '5px',
                        }}
                      />
                      <p style={{ fontSize: '13px' }}>
                        최대 {room.classroomCapacity}명
                      </p>
                    </div>
                  </ClassroomCard>
                ))}
              </ClassroomGrid>
            </>
          ) : (
            <p style={{ color: '#6b7280' }}>
              {isSearching
                ? '조건에 맞는 강의실이 없습니다.'
                : '단과대를 선택해주세요.'}
            </p>
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
  background: ${(props) => (props.$active ? '#EFF2F6' : '#fff')};
  color: ${(props) => (props.$active ? '#263A73' : '#868686')};
  font-size: 18px;
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
  cursor: pointer;
  border-right: ${(props) =>
    props.$active ? '4px solid #263A73' : '4px solid transparent'};
  border-radius: 0;
  transition: 0.3s;

  &:hover {
    background: #eff2f6;
  }
  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0px;
  margin-top: -5px;
  margin-bottom: 18px;
  background-color: #f0f0f0;
  padding: 6px 6px 6px 6px;
  border: 1px solid #a0a0a0;
  border-radius: 5px;
  width: 75vw; // 화면 너비의 75%를 차지하겠다.
  height: 30px;
`;
// 달력 헤더 만드는데 쓰는 style
const Container = styled.div`
  display: flex;
  flex: 1; // 나머지 공간 다 차지
  height: 100%; // 부모요소 height의 100%를 차지하겠다(단 부모요소의 height가 px로 지정되어있어야 가능)
  gap: 0px; // gap 없애고 margin으로 조정
  background: #f0f0f0;
  padding: 0px;
  border-radius: 6px;
  padding-right: 0px;
`;

// 달력 헤더 만드는데 쓰는 style - DatePicker 라이브러리
const Picker = styled(DatePicker)`
  flex: 1; // 너비를 자동으로 분배
  margin-right: 10px;
  width: 290px;
  height: 30px;
  padding: 0 32px 0 10px; // 오른쪽 아이콘 공간 확보
  background: white url(${dateIcon}) no-repeat right 10px center;
  background-size: 13px 13px;
  border: none;
  border-radius: 6px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    filter: brightness(0.98);
  }
  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
  }
`;

const TimePicker = styled(DatePicker)`
  flex: 1; // 너비를 자동으로 분배
  margin-right: 10px;
  width: 290px;
  height: 30px;
  padding: 0 32px 0 10px; // 오른쪽 아이콘 공간 확보
  background: white url(${starttimeIcon}) no-repeat right 10px center;
  background-size: 12px 6px;
  border: none;
  border-radius: 6px;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    filter: brightness(0.98);
  }
  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
  }
`;
// 화살표 위치 변경
export const DatePickerFix = createGlobalStyle`
  .react-datepicker__triangle {
    left: 32px !important;
  }
`;

const SearchButton = styled.button`
  flex: 1; /* 고정 너비 또는 비율 조정 가능 */
  width: 15%;
  height: 100%;
  padding: 3px 7px;
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
