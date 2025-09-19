const timeStep = 30; // 5 | 10 | 15 | 30 minutes

export const schedule = [
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
    startTime: "2025-08-28T20:00:00+00:00",
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
];

export const lessons = [
  {
    id: 52,
    duration: 60,
    startTime: "2025-08-25T13:30:00+00:00",
    endTime: "2025-08-25T14:29:59+00:00",
    student: "Alex",
  },
  {
    id: 53,
    duration: 90,
    startTime: "2025-08-31T00:30:00+00:00",
    endTime: "2025-08-31T01:59:59+00:00",
    student: "Michael",
  },
  {
    id: 54,
    duration: 90,
    startTime: "2025-08-27T04:00:00+00:00",
    endTime: "2025-08-27T05:29:59+00:00",
    student: "John",
  },
  {
    id: 55,
    duration: 60,
    startTime: "2025-08-25T02:30:00+00:00",
    endTime: "2025-08-25T03:29:59+00:00",
    student: "Bill",
  },
];

export const initMyLessons = [
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
];

export default timeStep;
