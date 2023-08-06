import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";
import { useSelector } from "react-redux";
import { selectCurrentClasses } from "../../features/class/classSlice";

function Calendar() {
  const data = useSelector(selectCurrentClasses);

  const classEvents = [];

  data?.forEach((e) => {
    classEvents.push({
      daysOfWeek: [e.lectureTime.day],
      startRecur: e.startingDate,
      startTime: `${e.lectureTime.hour}:00`,
      endTime: `${e.lectureTime.hour + 2}:00`,
      title: e.className,
    });
  });

  const eventClick = (info) => {
    console.log("pes");
    console.log(info);
  };

  return (
    <div className="calendar">
      <Fullcalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        views={["dayGridMonth", "timeGridWeek"]}
        initialView={"timeGridWeek"}
        editable={false}
        headerToolbar={{
          start: "prev,next",
          end: "timeGridWeek dayGridMonth",
        }}
        weekends={false}
        locale={"en-de"}
        slotMinTime={"09:00"}
        slotMaxTime={"21:00"}
        events={classEvents}
        allDaySlot={false}
        eventClick={(info) => eventClick(info)}
        selectMirror={true}
        dayMaxEvents={true}
      />
    </div>
  );
}

export default Calendar;
