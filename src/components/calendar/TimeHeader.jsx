import React, { memo } from "react";

const timeHeader = "Time";

const TimeHeader = memo(({ timeStep }) => (
  <>
    <div className="bg-[#2c3e50] text-white text-[12px] font-bold items-center justify-center flex">
      {timeHeader}
    </div>
    {Array.from({ length: (24 * 60) / timeStep }).map((_, index) => {
      const timeInMinutes = index * timeStep;
      const hour = ("0" + Math.floor(timeInMinutes / 60)).slice(-2);
      const minute = ("0" + (timeInMinutes - hour * 60)).slice(-2);
      return (
        <div key={index} style={{ gridRow: index + 2 }} className="time-slot">
          {`${hour}:${minute}`}
        </div>
      );
    })}
  </>
));

export default TimeHeader;
