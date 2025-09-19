import React from "react";

const weekDays = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const ScheduleHeader = ({ currentStartDate, dayIndex }) => {
  const weekLength = Object.keys(weekDays).length;
  const weekDayIndex = currentStartDate?.getDay() + dayIndex;
  return (
    <div
      style={{ gridColumn: dayIndex + 2 }}
      className="bg-[#34495e] text-white text-[14px] font-bold items-center justify-center flex"
    >
      {weekDays[weekDayIndex >= weekLength ? weekDayIndex - weekLength : weekDayIndex]}
    </div>
  );
};

export default ScheduleHeader;
