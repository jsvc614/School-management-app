import React, { useEffect, useState } from "react";
import { useGetStudentAttendanceQuery } from "../../features/user/userService";
import Select from "react-select";
import styles from "./StudentGrades.module.css";
import { useSelector } from "react-redux";
import { selectCurrentClasses } from "../../features/class/classSlice";
import { getAttendanceDays } from "../../utils/getAttendanceDays";
import LoadingSpinner from "../spinner/Spinner";
import ErrorModal from "../pop/ErrorModal";

const colourStyles = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? "#999999" : null,
      color: "#333333",
    };
  },
};

const StudentAttendance = () => {
  const [selectedClass, setSelectedClass] = useState();

  const [showErrorModal, setShowErrorModal] = useState();

  const { data, isSuccess, isLoading, isError } =
    useGetStudentAttendanceQuery();

  useEffect(() => {
    if (isSuccess) {
      setSelectedClass(data[0].className);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  const handleSelectClass = (e) => {
    setSelectedClass(e.value);
  };

  const filteredDataClass = data?.filter(
    (cla) => cla.className === selectedClass
  )[0];

  const currentClass = useSelector(selectCurrentClasses).filter(
    (c) => c.className === selectedClass
  )[0];

  let classDates;

  if (currentClass) {
    let attendanceDays;

    attendanceDays = getAttendanceDays(
      currentClass.lectureTime.day,
      currentClass.startingDate,
      new Date()
    );

    classDates = attendanceDays.map((day) => {
      let attended = "missed";

      filteredDataClass.students.attendance?.forEach((filtClass) => {
        if (filtClass.date.slice(0, 10) === day && filtClass.attended) {
          attended = "attended";
        }
      });
      return (
        <tr key={day} style={{ cursor: "auto" }}>
          <td>{currentClass.className}</td>
          <td>{day}</td>
          <td>{attended}</td>
        </tr>
      );
    });
  }
  const classOptions = data?.map((className) => {
    // return <option key={uuidv4()}>{className._id}</option>;
    return { value: className.className, label: className.className };
  });

  return (
    <div>
      <div className={styles.selectContainer}>
        <Select
          onChange={handleSelectClass}
          defaultValue={selectedClass}
          className={styles.gradeOption}
          options={classOptions}
          styles={colourStyles}
          placeholder="Choose a class"
        />
      </div>
      {isSuccess && classDates?.length > 0 && (
        <>
          <h1>{selectedClass}</h1>
          <table className={styles.gradeTable}>
            <tbody>
              <tr>
                <th>Class</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
              {classDates}
            </tbody>
          </table>
        </>
      )}
      {isLoading && <LoadingSpinner />}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with getting student attendance"}
        />
      )}
    </div>
  );
};

export default StudentAttendance;
