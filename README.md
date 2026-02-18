# React Calendar Component
### Demo of result: [https://alexanderkireev.github.io/calendar/](https://alexanderkireev.github.io/calendar/)

(tivali)[window.location.href = "http://192.168.31.87:3000"]

## Install
```sh
npm ci
```
## Start
```sh
npm run dev
```
### Requirements: 

The goal is to create a component that displays a teacher’s schedule. The calendar should be divided into 30-minute slots for the entire day. Slots outside the teacher’s schedule (white color) should not be interactive. Slots within the teacher’s schedule (light green) should have a duration of 30 minutes and be interactive (for example, they should display an alert with the slot’s time). Lessons (red color) can be 30, 60, or 90 minutes long, are presented as a single block, and should also be interactive (for example, display an alert with the lesson’s time).
1. Views
 - Desktop:
   - Week view (7 days).
 - Mobile:
   - Day view (1 day).
   - 3-day view (3 days).
 - Switch views depending on screen size.
___
2. Navigation
- Controls:  <   >
  - < → moves view range back (by 1 day, 3 days, or 1 week depending on active view).
  - \> → moves forward the same way.
___
3. Time Slots
- Granularity: configurable (default 30 minutes).
- Visible range: e.g., 00:00–24:00.
- Each slot maps to one or more grid cells.
- Each cell can be:
  - Not available (e.g., outside working hours, white).
  - Available (clickable, styled green).
  - Booked (clickable, styled red with student name).
___
4. Layout & Responsiveness
- CSS Grid structure:
  - Columns = days in view.
  - Rows = time slots.
  - First column = time labels.
- Desktop:
  - grid-cols-[time + 7 days]
- Mobile:
  - Switch to grid-cols-[time + 1/3 days] with horizontal scroll if needed.
 - Use overflow-x-auto for small screens.
___
5. Interaction
- Click Available slot → triggers callback (e.g., onSlotSelect(slot)).
- Hover → highlight cell.
- Booked slot should show tooltip or inline info (student name, duration) on click show context menu
- Booked By Other -> no interaction
___
6. Data Structure
Input prop:
```js
type Schedule = [
  {
    "startTime": "2025-08-23T22:30:00+00:00",
    "endTime": "2025-08-24T02:29:59+00:00"
  },
  {
    "startTime": "2025-08-25T01:30:00+00:00",
    "endTime": "2025-08-25T04:59:59+00:00"
  },
  {
    "startTime": "2025-08-25T11:00:00+00:00",
    "endTime": "2025-08-25T19:29:59+00:00"
  },
  {
    "startTime": "2025-08-27T02:30:00+00:00",
    "endTime": "2025-08-27T06:59:59+00:00"
  },
  {
    "startTime": "2025-08-28T23:00:00+00:00",
    "endTime": "2025-08-29T08:29:59+00:00"
  },
  {
    "startTime": "2025-08-30T22:30:00+00:00",
    "endTime": "2025-08-31T02:29:59+00:00"
  },
  {
    "startTime": "2025-09-01T01:30:00+00:00",
    "endTime": "2025-09-01T04:59:59+00:00"
  },
  {
    "startTime": "2025-09-01T11:00:00+00:00",
    "endTime": "2025-09-01T19:29:59+00:00"
  }
]
```
```js
type Lesson = [
  {
    "id": 52,
    "duration": 60,
    "startTime": "2025-08-25T13:30:00+00:00",
    "endTime": "2025-08-25T14:29:59+00:00",
    "student": "Alex"
  },
  {…}
]
```
```js
type CalendarProps = {
  view: "day" | "3days" | "week";
  startDate: Date; // start of current view
  schedule:[]
  lessons: [];
 onSlotSelect?: (slot: { startTime: Date; endTime: Date }) => void;
};
```
___
7. Styling
- TailwindCSS utility classes.
- Color coding:
  - bg-green-200 → available.
  -	bg-red-300 → booked.
  - bg-gray-100 → blocked/off-hours.
- Responsive typography for day labels.
___
You can use AI but you need to understand the code!
