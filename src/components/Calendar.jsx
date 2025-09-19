import React, { useEffect, useState } from "react";
import _ from "lodash";
import Navbar from "./calendar/Navbar.jsx";
import ScheduleHeader from "./calendar/ScheduleHeader.jsx";
import TimeHeader from "./calendar/TimeHeader.jsx";
import Lesson from "./calendar/Lesson.jsx";
import timeStep, { initMyLessons } from "../data.js";

const Calendar = ({ view, startDate, schedule, lessons, sendSelectedSlots }) => {
  const [currentStartDate, setCurrentStartDate] = useState(startDate);
  const [myLessons, setMyLessons] = useState(initMyLessons);
  const [maxId, setMaxId] = useState(0);
  const [isSaved, setIsSaved] = useState(true);

  const currentTimeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

  useEffect(() => {
    const ids = [...lessons, ...myLessons].map((item) => item.id);
    setMaxId(Math.max(...ids));
  }, []);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      sendSelectedSlots(myLessons);
    }, "300"); // 300ms waiting for change cells color to blue
  };

  const handlePrev = () => {
    const newDate = new Date(currentStartDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === "3days") {
      newDate.setDate(newDate.getDate() - 3);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentStartDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentStartDate);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === "3days") {
      newDate.setDate(newDate.getDate() + 3);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentStartDate(newDate);
  };

  const isSlotAvailable = (slot) => {
    const date = new Date(slot.getTime() - currentTimeZoneOffset);
    return schedule.some((s) => new Date(s.startTime) <= date && new Date(s.endTime) > date);
  };

  const getLesson = (slot, lessons) => {
    const date = new Date(slot.getTime() - currentTimeZoneOffset);
    const lesson = lessons.find((l) => new Date(l.startTime) <= date && new Date(l.endTime) > date);
    let isFirstLessonHour = false;
    if (lesson) {
      isFirstLessonHour = new Date(lesson.startTime).getTime() === new Date(date).getTime();
    }
    return { lesson, isFirstLessonHour };
  };

  const handleAddBooking = (slot) => {
    const lessons = [...myLessons];
    const startTime = new Date(slot.getTime() - currentTimeZoneOffset);
    const minutes = startTime.getMinutes();
    if (minutes >= 30) {
      startTime.setMinutes(30);
    } else {
      startTime.setMinutes(0);
    }
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
      const lessonDate = new Date(startLessonTime.getTime() + currentTimeZoneOffset);
      const slotDate = new Date(startTime.getTime() + currentTimeZoneOffset);
      const isSameDay = lessonDate.getDay() === slotDate.getDay();
      return startLessonTime >= prevDate && endLessonTime.getTime() === startTime.getTime() - 1000 && isSameDay;
    });

    const nextLesson = myLessons.find((lesson) => {
      const startLessonTime = new Date(lesson.startTime);
      const endLessonTime = new Date(lesson.endTime);
      const lessonDate = new Date(startLessonTime.getTime() + currentTimeZoneOffset);
      const slotDate = new Date(startTime.getTime() + currentTimeZoneOffset);
      const isSameDay = lessonDate.getDay() === slotDate.getDay();
      return startLessonTime.getTime() === endTime.getTime() + 1000 && endLessonTime < nextDate && isSameDay;
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

  return (
    <>
      <Navbar handlePrev={handlePrev} handleNext={handleNext} handleSave={handleSave} />
      <div
        className="grid gap-px bg-[#e0e0e0] rounded-sm overflow-hidden"
        style={{
          gridTemplateRows: `40px repeat(${(24 * 60) / timeStep}, 30px)`,
          gridTemplateColumns: `80px repeat(${
            view === "week" ? "7" : view === "3days" ? "3" : "1"
          }, 1fr)`,
        }}
      >
        <TimeHeader timeStep={timeStep} />
        {Array.from({
          length: view === "week" ? 7 : view === "3days" ? 3 : 1,
        }).map((_, dayIndex) => {
          return (
            <React.Fragment key={dayIndex}>
              <ScheduleHeader currentStartDate={currentStartDate} dayIndex={dayIndex} />
              {Array.from({ length: (24 * 60) / timeStep }).map((_, index) => {
                const currentSlot = new Date(
                  currentStartDate.getTime() +
                    (dayIndex * 24 * 60 + index * timeStep) * 60 * 1000 +
                    currentTimeZoneOffset,
                );
                const isAvailable = isSlotAvailable(currentSlot);
                const { lesson, isFirstLessonHour } = getLesson(currentSlot, lessons);
                const { lesson: myLesson, isFirstLessonHour: isFirstMyLessonHour } = getLesson(
                  currentSlot,
                  myLessons,
                );
                if (isFirstLessonHour || isFirstMyLessonHour) {
                  return (
                    <Lesson
                      key={index}
                      index={index}
                      dayIndex={dayIndex}
                      timeStep={timeStep}
                      lesson={isFirstMyLessonHour ? myLesson : lesson}
                      isMyLesson={isFirstMyLessonHour}
                      handleRemoveBooking={handleRemoveBooking}
                      isSaved={isSaved}
                      setIsSaved={setIsSaved}
                    />
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
                          ? "bg-green-200 schedule-cell cursor-pointer"
                          : "bg-gray-100 schedule-cell"
                      }`}
                      onClick={() => {
                        if (isAvailable) {
                          handleAddBooking(currentSlot) & setIsSaved(false);
                        }
                      }}
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
    </>
  );
};

export default Calendar;
