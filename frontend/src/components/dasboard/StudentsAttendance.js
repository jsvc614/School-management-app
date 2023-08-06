import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentClasses } from "../../features/class/classSlice";
import { Chart as ChartJS } from "chart.js/auto";
import randomColor from "randomcolor";
import styles from "./StudentsAttendance.module.css";
import BarChart from "./BarChart";

const StudentsAttendance = () => {
  const userClasses = useSelector(selectCurrentClasses);

  let classesAttendance;
  let userData;

  if (Array.isArray(userClasses)) {
    classesAttendance = userClasses
      ?.filter(
        (userClass) =>
          userClass?.students.length !== 0 &&
          userClass?.students[0].attendance.length !== 0
      )
      .map((userClass, index) => {
        let attended = 0;
        let totalHours = 0;

        userClass.students.forEach((student) => {
          student.attendance.forEach((studentDate) => {
            totalHours += 1;
            if (studentDate.attended) {
              attended += 1;
            }
          });
        });
        return {
          id: index + 1,
          className: userClass.className,
          attendance: (attended / totalHours) * 100,
        };
      });
    userData = {
      labels: classesAttendance?.map(
        (classAttendance) => classAttendance.className
      ),
      datasets: [
        {
          label: "Class attendance",
          data: classesAttendance.map(
            (classAttendance) => classAttendance.attendance
          ),
          backgroundColor: classesAttendance.map(() => randomColor()),
          borderColor: "black",
          borderWidth: 2,
          barPercentage: classesAttendance.length < 3 ? 0.25 : 0.5,
          categoryPercetange: 1,
        },
      ],
    };
  }
  const options = {
    scales: {
      y: {
        ticks: {
          min: 0,
          max: 100,
          stepSize: 20,
          callback: (value) => {
            return value.toFixed(2) + "%";
          },
        },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw.toFixed(2) + "%";
          },
        },
      },
      legend: {
        labels: {
          font: { size: 20 },
          boxWidth: 0,
          fontColor: ["rgb(60, 60, 60)"],
        },
        onClick: null,
      },
    },
    maintainAspectRatio: false,
  };

  let chart;

  if (classesAttendance && classesAttendance.length > 0) {
    chart = <BarChart data={userData} options={options} />;
  }

  return <div className={styles.attendanceChart}>{chart}</div>;
};

export default StudentsAttendance;
