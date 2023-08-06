import React, { useContext, useEffect, useState } from "react";
import stringDate from "../../utils/stringDate";
import { useGetScheduleQuery } from "../../features/asignments/asignmentService";
import styles from "./UpcomingTests.module.css";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../spinner/Spinner";
import { BsFillArrowRightSquareFill } from "react-icons/bs";

const UpcomingTests = ({ data, tests }) => {
  // const { data, isLoading } = useGetScheduleQuery();

  const navigate = useNavigate();

  const selectCLass = (id) => {
    navigate(`/classes/${id}`);
  };

  const selectTest = (id) => {
    navigate(`/classes/${id}/asignments`);
  };

  const upcomingEvents = data?.testsSchedule.slice(0, 5).map((event) => {
    const day = stringDate(event.submissionDate);
    return (
      <div
        key={event._id}
        onClick={() => selectTest(event.class)}
        className={styles.eventRow}
      >
        {event.name} | {day}
        <div className={styles.moveIcon}>
          <BsFillArrowRightSquareFill />
          {/* <span className={styles.notificationTooltip}>More info</span> */}
        </div>
      </div>
    );
  });

  const upcomingClasses = data?.classesSchedule
    .slice(0, 5)
    .map((event) => {
      const date = new Date();

      const nextDate = new Date(
        date.setDate(
          date.getDate() +
            ((7 - date.getDay() + event.lectureTime.day) % 7 || 7)
        )
      );

      nextDate.setHours(event.lectureTime.hour, 0, 0);

      return {
        ...event,
        nextDate,
      };
    })
    .sort((a, b) => a.nextDate - b.nextDate);

  let content = "";

  if (upcomingClasses?.length > 0) {
    content = (
      <div className={styles.upcomingTests}>
        <h2>Upcoming classes</h2>
        {upcomingClasses.map((upcomingC) => {
          return (
            <div
              key={upcomingC._id}
              onClick={() => selectCLass(upcomingC._id)}
              className={styles.eventRow}
            >
              {upcomingC.className} | {stringDate(upcomingC.nextDate)}
              <div className={styles.moveIcon}>
                <BsFillArrowRightSquareFill />
                <span className={styles.notificationTooltip}>More info</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (tests && upcomingClasses?.length > 0) {
    content = (
      <div className={styles.upcomingTests}>
        <h2>Upcoming tests</h2>
        {upcomingEvents}
      </div>
    );
  }

  return content;
};

export default UpcomingTests;
