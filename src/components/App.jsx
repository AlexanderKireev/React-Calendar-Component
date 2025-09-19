import React, { useEffect, useState } from "react";
import Calendar from "./Calendar.jsx";
import { schedule, lessons } from "../data.js";

const App = () => {
  const [view, setView] = useState("week");

  useEffect(() => {
    const updateView = () => {
      const width = window.innerWidth;
      switch (true) {
        case width >= 1024:
          setView("week");
          break;
        case width >= 768 && width < 1024:
          setView("3days");
          break;
        case width < 768:
          setView("day");
          break;
      }
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => {
      window.removeEventListener("resize", updateView);
    };
  }, []);

  const handleSelectedSlotsSend = (data) => {
    alert(`Selected slots sent to the server: ${JSON.stringify(data)}`);
  };

  return (
    <Calendar
      view={view}
      startDate={new Date(Date.UTC(2025, 7, 25, 0, 0))}
      schedule={schedule}
      lessons={lessons}
      sendSelectedSlots={handleSelectedSlotsSend}
    />
  );
};

export default App;
