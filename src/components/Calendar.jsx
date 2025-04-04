import React, { useState } from "react";
import styled from "styled-components";

const Calendar = ({
  selectedDate,
  setSelectedDate,
  selectedTimeRange,
  setSelectedTimeRange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(1 - firstDayOfMonth.getDay());

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const endDay = new Date(lastDayOfMonth);
  endDay.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

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
    if (selectedTimeRange.start === time && selectedTimeRange.end === time) {
      setSelectedTimeRange({ start: null, end: null });
    } else if (!selectedTimeRange.start) {
      setSelectedTimeRange({ start: time, end: time });
    } else {
      setSelectedTimeRange((prev) => {
        const newStart = Math.min(prev.start, time);
        const newEnd = Math.max(prev.end, time);
        return { start: newStart, end: newEnd };
      });
    }
  };

  const weeks = groupDatesByWeek(startDay, endDay);
  const timeSlots = Array.from({ length: 9 }, (_, i) => 18 + i * 0.5);

  return (
    <CalendarContainer>
      <Header>
        <NextButton onClick={handlePrevMonth}>◀</NextButton>
        <h3>
          {year}년 {month + 1}월
        </h3>
        <NextButton onClick={handleNextMonth}>▶</NextButton>
      </Header>
      <Grid>
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <Day key={day} style={{ fontWeight: "bold" }}>
            {day}
          </Day>
        ))}
        {weeks.flat().map((date, index) => (
          <Day
            key={index}
            onClick={() => handleDateClick(date)}
            style={{
              color:
                selectedDate &&
                selectedDate.toDateString() === date.toDateString()
                  ? "#fff"
                  : date.getMonth() === month
                  ? "black"
                  : "#BFBFBF",
              backgroundColor:
                selectedDate &&
                selectedDate.toDateString() === date.toDateString()
                  ? "#4F4F4F"
                  : "transparent",
              cursor: "pointer",
              borderRadius: "10px",
            }}
          >
            {date.getDate()}
          </Day>
        ))}
      </Grid>
      {selectedDate && (
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
                <TimeLabel>{`${Math.floor(time)}:${
                  time % 1 === 0.5 ? "30" : "00"
                }`}</TimeLabel>
              </TimeSlotContainer>
            ))}
          </TimeRow>
        </TimeSelection>
      )}
    </CalendarContainer>
  );
};

export default Calendar;

const CalendarContainer = styled.div`
  width: 650px;
  height: 450px;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const NextButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: #fff;
  margin-left: 20px;
  margin-right: 20px;
`;

const Day = styled.div`
  padding: 10px;
  text-align: center;
  border: none;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TimeSelection = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const TimeRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const TimeSlotContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 10%;
`;

const TimeLabel = styled.div`
  font-size: 12px;
  margin-bottom: 5px;
`;

const TimeSlot = styled.div`
  width: 100%;
  height: 60px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#263A73" : "#F6F7F8")};
  border-radius: 5px;
  transition: background-color 0.3s;
`;
