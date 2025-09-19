import React from "react";

const Lesson = ({
  index,
  dayIndex,
  timeStep,
  lesson,
  isMyLesson,
  handleRemoveBooking,
  isSaved,
  setIsSaved,
}) => (
  <div
    data-text={`Booked by ${lesson.student}, duration ${lesson.duration} min`}
    onClick={(e) => {
      if (isMyLesson) {
        handleRemoveBooking(lesson.id) & setIsSaved(false);
      } else {
        e.currentTarget.classList.add(`${index > 1 ? "tooltip-top" : "tooltip-bottom"}`);
      }
    }}
    onMouseEnter={(e) => {
      if (isMyLesson && isSaved) {
        e.currentTarget.classList.add(`${index > 1 ? "tooltip-top" : "tooltip-bottom"}`);
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.classList.remove(`${index > 1 ? "tooltip-top" : "tooltip-bottom"}`);
    }}
    className={`${
      isMyLesson ? (isSaved ? "bg-blue-300 lesson" : "bg-orange-300 lesson") : "bg-red-300 lesson"
    }`}
    style={{
      gridRow: `${index + 2}/${index + lesson.duration / timeStep + 2}`,
      gridColumn: dayIndex + 2,
    }}
  >
    {lesson.student}
    <div className="lesson-duration">{`${lesson.duration} min`}</div>
  </div>
);

export default Lesson;
