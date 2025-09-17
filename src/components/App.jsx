import React, { useEffect, useState } from "react";
import Calendar from "./Calendar.jsx";

const App = () => {
  const [view, setView] = useState("pc");

  useEffect(() => {
    const updateView = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setView("week");
      } else if (width >= 768 && width < 1024) {
        setView("3days");
      } else {
        setView("day");
      }
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => {
      window.removeEventListener("resize", updateView);
    };
  }, []);

  const schedule = [
    {
      startTime: "2025-08-23T22:30:00+00:00",
      endTime: "2025-08-24T02:29:59+00:00",
    },
    {
      startTime: "2025-08-25T01:30:00+00:00",
      endTime: "2025-08-25T04:59:59+00:00",
    },
    {
      startTime: "2025-08-25T11:00:00+00:00",
      endTime: "2025-08-25T19:29:59+00:00",
    },
    {
      startTime: "2025-08-27T02:30:00+00:00",
      endTime: "2025-08-27T06:59:59+00:00",
    },
    {
      startTime: "2025-08-28T23:00:00+00:00",
      endTime: "2025-08-29T08:29:59+00:00",
    },
    {
      startTime: "2025-08-30T22:30:00+00:00",
      endTime: "2025-08-31T02:29:59+00:00",
    },
    {
      startTime: "2025-09-01T01:30:00+00:00",
      endTime: "2025-09-01T04:59:59+00:00",
    },
    {
      startTime: "2025-09-01T11:00:00+00:00",
      endTime: "2025-09-01T19:29:59+00:00",
    },
    {
      startTime: "2025-08-28T06:00:00+00:00",
      endTime: "2025-08-28T16:59:59+00:00",
    },
  ];

  const lessons = [
    {
      id: 52,
      duration: 60,
      startTime: "2025-08-25T13:30:00+00:00",
      endTime: "2025-08-25T14:29:59+00:00",
      student: "Alex",
    },

    // {
    //   id: 53,
    //   duration: 90,
    //   startTime: "2025-08-24T00:30:00+00:00",
    //   endTime: "2025-08-24T01:59:59+00:00",
    //   student: "Michael",
    // },
    // {
    //   id: 54,
    //   duration: 90,
    //   startTime: "2025-08-27T04:00:00+00:00",
    //   endTime: "2025-08-27T05:29:59+00:00",
    //   student: "John",
    // },
    // {
    //   id: 55,
    //   duration: 60,
    //   startTime: "2025-08-25T02:30:00+00:00",
    //   endTime: "2025-08-25T03:29:59+00:00",
    //   student: "Bill",
    // },
  ];

  const handleBookingSlotsSend = (slots) => {
    alert(`Selected slots sent to the server: ${JSON.stringify(slots)}`);
  };

  return (
    <Calendar
      view={view}
      startDate={new Date(Date.UTC(2025, 7, 25, 0, 0))}
      schedule={schedule}
      lessons={lessons}
      sendSelectedSlots={handleBookingSlotsSend}
    />
  );
};

export default App;
