import React, { useState } from "react";
import { selectCurrentClasses } from "../../../features/class/classSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAttendanceDays } from "../../../utils/getAttendanceDays";
import styles from "./ClassAttendance.module.css";
import FillClassAttendance from "./FillClassAttendance";

const ClassAttendance = () => {
  const [showFillAttendance, setShowFillAttendance] = useState(false);

  const [selectedClassDate, setSelectedClassDate] = useState();

  const { classId } = useParams();

  const currentClass = useSelector(selectCurrentClasses).filter(
    (c) => c._id === classId
  )[0];

  const handleSelectClassDate = (day) => {
    setShowFillAttendance(true);
    setSelectedClassDate(day);
  };

  let attendanceDays;

  let classDates;

  if (currentClass) {
    attendanceDays = getAttendanceDays(
      currentClass.lectureTime.day,
      currentClass.startingDate,
      new Date()
    );

    classDates = attendanceDays.map((day) => {
      return (
        <tr key={day} onClick={() => handleSelectClassDate(day)}>
          <td>{currentClass.className}</td>
          <td>{day}</td>
          <td>In progress</td>
        </tr>
      );
    });
  }

  return (
    <>
      <div>
        <h1>Class attendance</h1>
        <table className={styles.attendanceTable}>
          <tbody>
            <tr>
              <th>Class</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
            {classDates}
          </tbody>
        </table>
      </div>
      {showFillAttendance && (
        <FillClassAttendance
          show={showFillAttendance}
          close={() => setShowFillAttendance(false)}
          students={currentClass?.students}
          selectedClassDate={selectedClassDate}
        />
      )}
    </>
  );
};

export default ClassAttendance;
