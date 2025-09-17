import React, { useEffect, useState, memo } from "react";
import _ from "lodash";
import ScheduleHeader from "./calendar/ScheduleHeader.jsx";
// import 'flowbite';
import Tooltip from "./Tooltip.jsx";
// import PropTypes from "prop-types";

const timeHeader = "Time";

const initMyLessons = [
  {
    id: 1,
    duration: 90,
    startTime: "2025-08-29T00:30:00+00:00",
    endTime: "2025-08-29T01:59:59+00:00",
    student: "Me",
  },

  {
    id: 2,
    duration: 60,
    startTime: "2025-08-25T04:00:00+00:00",
    endTime: "2025-08-25T04:59:59+00:00",
    student: "Me",
  },
  {
    id: 3,
    duration: 30,
    startTime: "2025-08-27T03:00:00+00:00",
    endTime: "2025-08-27T03:29:59+00:00",
    student: "Me",
  },

  {
    id: 4,
    duration: 90,
    startTime: "2025-08-25T23:30:00+00:00",
    endTime: "2025-08-26T00:59:59+00:00",
    student: "Me",
  },
];

const timeStep = 30; // 30 minutes

const Calendar = ({ view, startDate, schedule, lessons, sendSelectedSlots }) => {
  const [currentView, setCurrentView] = useState(startDate);
  const [timeSlots, setTimeSlots] = useState([]);
  const [myLessons, setMyLessons] = useState(initMyLessons);
  const [maxId, setMaxId] = useState(0);
  const [currentTimeZoneOffset, setCurrentTimeZoneOffset] = useState(0);
  const [isSaved, setIsSaved] = useState(true);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 0; // 00:00
    const endHour = 24; // 24:00
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += timeStep) {
        const date = new Date(currentView);
        date.setHours(hour, minute, 0, 0);
        slots.push(date);
      }
    }
    return slots;
  };

  useEffect(() => {
    const ids = [...lessons, ...myLessons].map((item) => item.id);
    setMaxId(Math.max(...ids));
    const currentTimeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    setCurrentTimeZoneOffset(currentTimeZoneOffset);
  }, []);

  useEffect(() => {
    setTimeSlots(generateTimeSlots());
  }, [currentView]);

  const handleSave = () => {
    setIsSaved(true);
    sendSelectedSlots(myLessons);
  };

  const handlePrev = () => {
    const newDate = new Date(currentView);
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === "3days") {
      newDate.setDate(newDate.getDate() - 3);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentView(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentView);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === "3days") {
      newDate.setDate(newDate.getDate() + 3);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentView(newDate);
  };

  const handleAddBooking = (slot) => {
    setIsSaved(false);
    const lessons = [...myLessons];
    const startTime = new Date(slot.getTime() - currentTimeZoneOffset);
    const endTime = new Date(startTime.getTime() + (30 * 60 - 1) * 1000);
    const prevDate = new Date(startTime.getTime() - 60 * 60 * 1000);
    const nextDate = new Date(startTime.getTime() + 90 * 60 * 1000);

    const newLesson = {
      id: _.uniqueId() * 1 + maxId,
      duration: 30,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      student: "Me",
    };

    const prevLesson = myLessons.find((lesson) => {
      const startLessonTime = new Date(lesson.startTime);
      const endLessonTime = new Date(lesson.endTime);
      return startLessonTime >= prevDate && endLessonTime.getTime() === startTime.getTime() - 1000;
    });

    const nextLesson = myLessons.find((lesson) => {
      const startLessonTime = new Date(lesson.startTime);
      const endLessonTime = new Date(lesson.endTime);
      return startLessonTime.getTime() === endTime.getTime() + 1000 && endLessonTime < nextDate;
    });

    if (prevLesson) {
      newLesson.id = prevLesson.id;
      newLesson.duration = 30 + prevLesson.duration;
      newLesson.startTime = prevLesson.startTime;
      const indexOfPrevLesson = lessons.findIndex((l) => l.id === prevLesson.id);
      lessons.splice(indexOfPrevLesson, 1);
    }

    if (nextLesson && newLesson.duration + nextLesson.duration <= 90) {
      newLesson.id = nextLesson.id;
      newLesson.duration = newLesson.duration + nextLesson.duration;
      newLesson.endTime = nextLesson.endTime;
      const indexOfNextLesson = lessons.findIndex((l) => l.id === nextLesson.id);
      lessons.splice(indexOfNextLesson, 1);
    }
    lessons.push(newLesson);
    setMyLessons(lessons);
  };

  const handleRemoveBooking = (id) => setMyLessons(myLessons.filter((l) => l.id !== id));

  const isSlotAvailable = (slot) => {
    let originalDate = slot;
    let hoursToSubtract = 3 * 60 * 60 * 1000; // 3 часа * 60 минут * 60 секунд * 1000 миллисекунд
    let newDate = new Date(originalDate.getTime() + hoursToSubtract);
    return schedule.some((s) => new Date(s.startTime) <= newDate && new Date(s.endTime) > newDate);
  };

  const getLesson = (slot, lessons) => {
    // console.log(JSON.stringify(lessons));
    
    const date = new Date(slot.getTime() - currentTimeZoneOffset);
    const lesson = lessons.find((l) => new Date(l.startTime) <= date && new Date(l.endTime) > date);
    let isBegining = false;
    if (lesson) {
      isBegining = new Date(lesson.startTime).getTime() === new Date(date).getTime();
    }
    return { lesson, isBegining };
  };

  // const isLessonBooked = (slot) => {
  //   // console.log(slot);

  //   // Текущая дата и время
  //   let originalDate = slot;
  //   // console.log("Исходная дата: ", originalDate);

  //   // Создаем новое смещение времени (3 часа в миллисекундах)
  //   let hoursToSubtract = 3 * 60 * 60 * 1000; // 3 часа * 60 минут * 60 секунд * 1000 миллисекунд

  //   // Создаем новую дату, вычитая смещение
  //   let newDate = new Date(originalDate.getTime() + hoursToSubtract);
  //   // console.log("Новая дата (минус 3 часа): ", newDate);

  //   return lessons.some(
  //     (l) => new Date(l.startTime) <= newDate && new Date(l.endTime) > newDate
  //   );
  // };

  const TimeHeader = memo(() => (
    <>
      <div className="bg-[#2c3e50] text-white text-[12px] font-bold items-center justify-center flex">
        {timeHeader}
      </div>
      {timeSlots.map((slot, index) => (
        <div
          key={index}
          style={{ gridRow: index + 2 }}
          // className="bg-[#ecf0f1] flex items-center justify-center text-[10px] text-[#7f8c8d] border-r-2 border-solid border-[#bdc3c7] col-start-1"
          className="time-slot"
        >
          {slot.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ))}
    </>
  ));

  return (
    <>
      {/* <div
        id="tooltip-click"
        role="tooltip"
        className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
      >
        Tooltip content
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div> */}

      <div className="flex justify-between mb-2">
        {/* <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Default</button> */}

        {/* <button data-tooltip-target="tooltip-default" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Default tooltip</button> */}

        <div>
          <button
            onClick={handlePrev}
            type="button"
            className="text-white active:bg-blue-300 font-bold bg-blue-300 hover:bg-blue-400 focus:outline-none cursor-pointer rounded-sm text-sm px-4 py-2.5 text-center"
          >
            &lt;
          </button>

          <button
            onClick={handleSave}
            type="button"
            className="ml-2 text-white active:bg-blue-300 font-bold bg-blue-300 hover:bg-blue-400 focus:outline-none cursor-pointer rounded-sm text-sm px-4 py-2.5 text-center"
          >
            Save
          </button>
        </div>

        <span>{currentView.toLocaleDateString()}</span>

        {/* <Tooltip text="Это подсказка!"> */}
        <button
          onClick={handleNext}
          type="button"
          className="text-white active:bg-blue-300 font-bold bg-blue-300 hover:bg-blue-400 focus:outline-none cursor-pointer rounded-sm text-sm px-4 py-2.5 text-center"
        >
          &gt;
        </button>
        {/* </Tooltip> */}
      </div>

      <div
        className="grid grid-cols-[80px_repeat(1,1fr)] md:grid-cols-[80px_repeat(3,1fr)] lg:grid-cols-[80px_repeat(7,1fr)] grid-rows-[40px_repeat(48,30px)] gap-px bg-[#e0e0e0] rounded-sm overflow-hidden"
        // className="grid grid-cols-[80px_repeat(7,1fr)] grid-rows-[40px_repeat(48,30px)] gap-px bg-[#e0e0e0] rounded-sm overflow-hidden"

        // className={`grid grid-cols-${
        //   view === "week" ? "7" : view === "3days" ? "3" : "1"
        // } grid-rows-[repeat(48,1fr)]`}
      >
        <TimeHeader />
        {Array.from({
          length: view === "week" ? 7 : view === "3days" ? 3 : 1,
        }).map((_, dayIndex) => {
          return (
            <React.Fragment key={dayIndex}>
              <ScheduleHeader slot={timeSlots[0]} dayIndex={dayIndex} />
              {timeSlots.map((slot, index) => {
                const currentSlot = new Date(slot.getTime() + dayIndex * 24 * 60 * 60 * 1000);
                const isAvailable = isSlotAvailable(currentSlot);
                // const isBooked = isLessonBooked(currentSlot);
                // const slotEnd = new Date(currentSlot);
                // slotEnd.setMinutes(slotEnd.getMinutes() + 30);

                const { lesson, isBegining } = getLesson(currentSlot, lessons);
                const { lesson: myLesson, isBegining: isMyLessonBeginning } = getLesson(currentSlot, myLessons);
                // const x = "tooltip-default-" + index;
                // console.log(lessonDuration);

                // index = index + lessonDuration / 30;
                // if (isBooked) {
                //   console.log("fffffffffffffffffffff");
                // }

                {
                  /* <button data-tooltip-target="tooltip-animation" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Animated tooltip</button>

<div id="tooltip-animation" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
    Tooltip content
    <div class="tooltip-arrow" data-popper-arrow></div>
</div>






<button data-tooltip-target="tooltip-click" data-tooltip-trigger="click" type="button" class="ms-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Tooltip click</button>

<div id="tooltip-click" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
    Tooltip content
    <div class="tooltip-arrow" data-popper-arrow></div>
</div> */
                }

                if (isBegining) {
                  return (
                    // <Tooltip key={index} text="Это подсказка!">
                    <div
                      key={index}
                      style={{
                        gridRow: `${index + 2}/${index + lesson.duration / 30 + 2}`,
                        gridColumn: dayIndex + 2,
                        display: "flex",

                        // position: "relative",
                        // width: "100wh"
                        // top: 0,
                        // left: 0,
                        // height: "100%"
                        // transform: "translateX(-50%)",
                        // backgroundColor: "#333",
                        // color: "#fff",
                        // padding: "8px 12px",
                        // borderRadius: "4px",
                        // fontSize: "14px",
                        // whiteSpace: "nowrap",
                        // zIndex: 1000,
                        // boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                      // data-tooltip-target="tooltip-click"
                      // data-tooltip-trigger="click"
                      // type="button"
                      // className="ms-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"

                      // id="myButton"
                      // data-tooltip-target="tooltip-click"
                      // data-tooltip-trigger="click"
                      // type="button"
                      // onClick={() => handleBooking(currentSlot)}

                      // data-tooltip-target="tooltip-default"
                      // type="button"
                      // className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <Tooltip text="Это подсказка!">
                        <div className="bg-red-300 lesson">
                          {lesson.student}
                          <div className="lesson-duration">{`${lesson.duration} min`}</div>
                        </div>
                      </Tooltip>

                      {/* <Tooltip text="Это подсказка!"> */}
                    </div>
                    // </Tooltip>
                  );
                } else if (isMyLessonBeginning) {
                  return (
                    <div
                      key={index}
                      style={{
                        gridRow: `${index + 2}/${index + myLesson.duration / 30 + 2}`,
                        gridColumn: dayIndex + 2,
                      }}
                      className={`${isSaved ? "bg-blue-300 lesson" : "bg-orange-300 lesson"}`}
                      onClick={() => handleRemoveBooking(myLesson.id)}
                    >
                      {myLesson.student}
                      <div className="lesson-duration">{`${myLesson.duration} min`}</div>
                    </div>
                  );
                } else if (lesson || myLesson) {
                  return null;
                } else {
                  return (
                    <div
                      key={index}
                      style={{ gridRow: index + 2, gridColumn: dayIndex + 2 }}
                      className={`${
                        isAvailable
                          ? "bg-green-200 schedule-cell hover:bg-[#a7e3bc] cursor-pointer"
                          : "bg-gray-100 hover:bg-gray-200 schedule-cell"
                      }`}
                      // onClick={() => handleAddBooking(currentSlot)}
                      // onSlotSelect({ startTime: slot, endTime: slotEnd });
                      // }}
                      onClick={() => {
                        if (isAvailable) {
                          handleAddBooking(currentSlot);
                        }
                      }}
                      // onClick={() => {
                      //   if (isAvailable) {
                      //     onSlotSelect &&
                      //       onSlotSelect({ startTime: slot, endTime: slotEnd });
                      //   }
                      // }}
                      // onMouseEnter={(e) => {
                      //   e.currentTarget.classList.add("hover:bg-green-300");
                      // }}
                      // onMouseLeave={(e) => {
                      //   e.currentTarget.classList.remove("hover:bg-green-300");
                      // }}
                    >
                      {currentSlot.toLocaleString("eng", {
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                  );
                }
              })}
            </React.Fragment>
          );
        })}
      </div>
      {/* <button data-tooltip-target="tooltip-default" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Default tooltip</button>

<div id="tooltip-default" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
    Tooltip content
    <div className="tooltip-arrow" data-popper-arrow></div>
</div> */}
    </>
  );
};

export default Calendar;
