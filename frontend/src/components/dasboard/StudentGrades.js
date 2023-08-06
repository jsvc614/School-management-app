import React, { useEffect, useState } from "react";
import { useGetStudentGradesQuery } from "../../features/user/userService";
import { v4 as uuidv4 } from "uuid";
import styles from "./StudentGrades.module.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../spinner/Spinner";
import ErrorModal from "../pop/ErrorModal";

const StudentGrades = () => {
  const [selectedClass, setSelectedClass] = useState();

  const [showErrorModal, setShowErrorModal] = useState(false);

  const { data, isSuccess, isLoading, isError } = useGetStudentGradesQuery();

  useEffect(() => {
    if (isSuccess) {
      setSelectedClass(data[0].marks[0].class);
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

  const classOptions = data?.map((className) => {
    return { value: className.marks[0].class, label: className.marks[0].class };
  });

  const filteredClass = data?.filter(
    (cla) => cla.marks[0].class === selectedClass
  );

  const navigate = useNavigate();

  const navigateToClassAsignments = (className) => {
    navigate(`/classes/${className}/asignments`);
  };

  const classGrades = filteredClass?.map((givenClass) => {
    const grades = givenClass.marks.map((mark) => {
      return (
        <tr
          key={uuidv4()}
          onClick={() => navigateToClassAsignments(givenClass._id)}
        >
          <td>{mark.name}</td>
          <td>{mark.mark}</td>
          <td>{mark.points}</td>
        </tr>
      );
    });
    return grades;
  });

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused ? "#999999" : null,
        color: "#333333",
      };
    },
  };

  return (
    <div className={styles.studentGrades}>
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

      {isSuccess && classGrades?.length > 0 && (
        <>
          <h1>{selectedClass}</h1>
          <table className={styles.gradeTable}>
            <tbody>
              <tr>
                <th>Asignment</th>
                <th>Grade</th>
                <th>Points</th>
              </tr>
              {classGrades}
            </tbody>
          </table>
        </>
      )}
      {isLoading && <LoadingSpinner />}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with getting student grades"}
        />
      )}
    </div>
  );
};

export default StudentGrades;
