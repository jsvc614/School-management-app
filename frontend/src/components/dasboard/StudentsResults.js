import React, { useEffect, useState } from "react";
import { useGetStudentsResultsQuery } from "../../features/user/userService";
import BarChart from "./BarChart";
import randomColor from "randomcolor";
import styles from "./StudentsAttendance.module.css";
import LoadingSpinner from "../spinner/Spinner";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import ErrorModal from "../pop/ErrorModal";

const StudentsResults = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const user = useSelector(selectCurrentUser);

  const { data, isLoading, isError } = useGetStudentsResultsQuery(undefined, {
    skip: user?.role === "STUDENT",
  });

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  const results = [];

  data?.forEach((test) => {
    const existing = results.filter(
      (item) => item.className === test.className
    );
    if (existing.length) {
      const existingIndex = results.indexOf(existing[0]);
      results[existingIndex] = {
        className: test.className,
        studentsMarks:
          (results[existingIndex].studentsMarks + test.studentsMarks) / 2,
      };
    } else {
      results.push(test);
    }
  });

  const userData = {
    labels: results?.map((classResults) => classResults.className),
    datasets: [
      {
        label: "Average class grade",
        data: results.map((classResults) => classResults.studentsMarks),
        backgroundColor: results.map(() => randomColor()),
        borderColor: "black",
        borderWidth: 2,
        barPercentage: results.length < 3 ? 0.25 : 0.5,
        categoryPercetange: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          min: 0,
          max: 5,
          stepSize: 1,
          callback: (value) => {
            return "            " + value;
          },
        },
      },
    },

    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw.toFixed(2);
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

  return (
    <div className={styles.attendanceChart}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <BarChart data={userData} options={options} />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with getting students results"}
        />
      )}
    </div>
  );
};

export default StudentsResults;
