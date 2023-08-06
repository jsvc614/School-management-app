import moment from "moment";

export function getAttendanceDays(day, startDate, endDate = new Date()) {
  const start = moment(startDate);
  const end = moment(endDate);

  const days = [];

  const current = start.clone();

  while (current.day(7 + day).isBefore(end)) {
    days.push(current.clone().format("YYYY-MM-DD"));
  }

  return days;
}
