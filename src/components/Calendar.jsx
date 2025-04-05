import React, { useState, useEffect } from "react";
import styled from "styled-components";
// src 폴더 내 파일은 반드시 import 해서 사용해야 함.
import leftArrow from "../assets/images/left_arrow.png";
import rightArrow from "../assets/images/right_arrow.png";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Calendar = ({
  selectedDate,
  setSelectedDate,
  selectedTimeRange,
  setSelectedTimeRange,
  classroomId,
}) => {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  // 해당 달에 예약된 날들
  const [reservedDays, setReservedDays] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(1 - firstDayOfMonth.getDay());

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const endDay = new Date(lastDayOfMonth);
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  // 해당 달에 예약된 날들 api에서 정보 받아오기
  useEffect(() => {
    const fetchReservedDays = async () => {
      try {
        const baseUrl = "https://itsmeweb.store";
        const response = await axios.get(
          `${baseUrl}/api/classrooms/${classroomId}/reserved-days`,
          {
            params: {
              year: currentDate.getFullYear(),
              month: currentDate.getMonth() + 1,
            },
          }
        );

        console.log("📦 API Response:", response); // 전체 응답 객체
        console.log("📅 Reserved Days:", response.data.data); // 실제 예약 날짜들

        if (response.data.result === "SUCCESS") {
          setReservedDays(response.data.data); // ["2025-04-05", ...]
        } else {
          console.error("예약된 날짜 가져오기 실패:", response.data.error);
        }
      } catch (err) {
        console.error("예약된 날짜 요청 중 에러 발생", err);
      }
    };

    fetchReservedDays();
  }, [classroomId, currentDate]);

  // 달력 내용
  const groupDatesByWeek = (startDay, endDay) => {
    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDay);

    while (currentDate <= endDay) {
      currentWeek.push(new Date(currentDate));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(
      selectedDate && selectedDate.toDateString() === date.toDateString()
        ? null
        : date
    );
    setSelectedTimeRange({ start: null, end: null });
  };

  const handleTimeSelect = (time) => {
    // 이미 선택한 단일 시간 슬롯을 다시 클릭하면 해제
    if (selectedTimeRange.start === time && selectedTimeRange.end === time) {
      setSelectedTimeRange({ start: null, end: null });
    } // 아직 아무 시간도 선택하지 않았을 경우(첫번째 클릭은 시작 시간 = 끝 시간)
    else if (!selectedTimeRange.start) {
      setSelectedTimeRange({ start: time, end: time });
    } // 이미 시작 시간이 있고, 두번째 시간 클릭한 경우(범위 형태로 지정됨.)
    else if (
      selectedTimeRange.start != null &&
      selectedTimeRange.start == selectedTimeRange.end
    ) {
      setSelectedTimeRange((prev) => {
        const newStart = Math.min(prev.start, time);
        const newEnd = Math.max(prev.end, time);
        return { start: newStart, end: newEnd };
      });
    } // 시작시간, 끝시간이 이미 범위로 지정된 상태에서 시작시간 or 끝시간을 눌렀을 때
    else if (
      selectedTimeRange.start !== null &&
      selectedTimeRange.end !== null &&
      selectedTimeRange.start !== selectedTimeRange.end &&
      (selectedTimeRange.start === time || selectedTimeRange.end === time)
    ) {
      // time이 start 일때
      if (selectedTimeRange.start === time) {
        setSelectedTimeRange({
          start: selectedTimeRange.end,
          end: selectedTimeRange.end,
        });
      } // time이 end 일때
      else {
        setSelectedTimeRange({
          start: selectedTimeRange.start,
          end: selectedTimeRange.start,
        });
      }
    } // 범위 선택되어있는 상태에서 바깥 박스 선택했을 때
    else {
      setSelectedTimeRange((prev) => {
        const newStart = Math.min(prev.start, time);
        const newEnd = Math.max(prev.end, time);
        return { start: newStart, end: newEnd };
      });
    }

    // else if (selectedTimeRange.start && selectedTimeRange.end === null) {
    //   setSelectedTimeRange((prev) => {
    //     const newStart = Math.min(prev.start, time);
    //     const newEnd = Math.max(prev.end, time);
    //     return { start: newStart, end: newEnd };
    //   });
  };

  const weeks = groupDatesByWeek(startDay, endDay);
  // time slot 선택하는 부분 : 18:00부터 22:00까지 30분 단위로
  const timeSlots = Array.from({ length: 8 }, (_, i) => 18 + i * 0.5);

  // label 따로 배열 추가함.
  const timeLabels = Array.from({ length: 5 }, (_, i) => `${18 + i}:00`);

  return (
    <CalendarContainer>
      <Header>
        {/* < 같은 특수문자를 직접 쓰면 html 태그로 오해해서 오류남. -> html 엔티티로 쓰기 */}
        <NextContainer>
          <NextButton onClick={handlePrevMonth}>
            <img
              src={leftArrow}
              alt="왼쪽화살표"
              style={{ width: "30px", height: "30px" }}
            />
          </NextButton>
        </NextContainer>
        <h2>
          {year}년 {month + 1}월
        </h2>
        <NextContainer>
          {" "}
          <NextButton onClick={handleNextMonth}>
            <img
              src={rightArrow}
              alt="오른쪽화살표"
              style={{ width: "30px", height: "30px" }}
            />
          </NextButton>
        </NextContainer>
      </Header>
      <Grid>
        {" "}
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <Day key={day} style={{ fontWeight: "bold" }}>
            {day}
          </Day>
        ))}
      </Grid>
      <Divider />
      <Grid>
        {weeks.flat().map((date, index) => {
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");
          const localDateStr = `${y}-${m}-${d}`;

          const isReserved = reservedDays.includes(localDateStr);

          const isCurrentMonth = date.getMonth() === month;
          const isSelected =
            selectedDate && selectedDate.toDateString() === date.toDateString();

          return (
            <DayNumberContainer
              key={index}
              onClick={() => {
                if (!isReserved && isCurrentMonth) handleDateClick(date);
              }}
              style={{
                cursor: isReserved ? "default" : "pointer",
              }}
            >
              <DayNumber
                className={`
                  ${isSelected ? "selected" : ""}
                  ${isReserved ? "reserved" : ""}
                  ${!isCurrentMonth ? "other-month" : ""}
                `}
              >
                {date.getDate()}
              </DayNumber>
            </DayNumberContainer>
          );
        })}
      </Grid>

      {selectedDate && (
        // 여기부터 timeline 부분
        <TimeSelection>
          <TimeRow>
            {timeSlots.map((time, index) => (
              <TimeSlotContainer key={index}>
                <TimeSlot
                  onClick={() => handleTimeSelect(time)}
                  selected={
                    selectedTimeRange.start !== null &&
                    time >= selectedTimeRange.start &&
                    time <= selectedTimeRange.end
                  }
                />
              </TimeSlotContainer>
            ))}
            {/* 시간 라벨들 : 슬롯 사이에 배치되도록 30분단위가 아니고 1시간 단위로 함. */}
            {timeLabels.map((label, index) => (
              <TimeTick
                key={index}
                style={{ left: `${(index / (timeLabels.length - 1)) * 100}%` }}
              >
                {label}
              </TimeTick>
            ))}
          </TimeRow>
        </TimeSelection>
      )}
    </CalendarContainer>
  );
};

export default Calendar;

const CalendarContainer = styled.div`
  padding: 10px;
  width: 550px;

  text-align: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const Divider = styled.div`
  // 가로줄
  height: 1px;
  background-color: #ddd;
  margin: 0 10px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;
const NextContainer = styled.div`
  width: 20%;
  height: 20%;
  border: none;
  background-color: #fff;
  margin: 0px 20px; // 위, 아래는 10px, 좌,우 는 20px
`;

const NextButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: #fff;
  &:hover {
    filter: brightness(90%); // hover 시에 색 좀 어둡게
  }
  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
  }
`;

const Day = styled.div`
  height: 20px;

  color: #7e7e7e;
  padding: 10px;
  text-align: center;
  border: none;
  transition: background-color 0.3s, color 0.3s;
`;

const DayNumberContainer = styled.div`
  padding: 5px;
  // text-align: center;
  justify-content: center; /* 가로 정렬 */

  border: none;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    // filter: brightness(90%); // hover 시에 색 좀 어둡게
  }
`;
const DayNumber = styled.div`
  margin: auto;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
  color: #000; // 기본 색

  &.selected {
    background-color: #263a73;
    color: #fff;
  }

  &.reserved {
    background-color: #e3e7f4;
    color: #000000;
  }

  &.other-month {
    color: #bfbfbf; // 연한 회색
  }
`;

const TimeSelection = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const TimeRow = styled.div`
  height: 50px;
  margin-bottom: 20px;
  width: 550px;
  display: flex;
  gap: 2px;

  justify-content: space-between;
  position: relative; // 라벨 위치 기준
`;

const TimeSlotContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
  margin: 0px;
`;

const TimeLabel = styled.div`
  font-size: 12px;
  margin-bottom: 5px;
`;

const TimeSlot = styled.div`
  margin: 0px;
  flex: 1;

  width: 100%;
  height: 60px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#263A73" : "#F6F7F8")};
  border-radius: 5px;
  transition: background-color 0.3s;
  &:hover {
    filter: brightness(90%); // hover 시에 색 좀 어둡게
  }
`;

const TimeTick = styled.div`
  position: absolute;
  top: 120%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #888;
  pointer-events: none;
`;
