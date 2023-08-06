import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import styles from "./ClassAttendance.module.css";
import { useFillClassAttendanceMutation } from "../../../features/class/classService";
import { useParams } from "react-router-dom";
import stringDate from "../../../utils/stringDate";
import CreatedModalSuccess from "../../../components/pop/CreatedModalSuccess";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ErrorModal from "../../../components/pop/ErrorModal";

const FillClassAttendance = ({ show, close, students, selectedClassDate }) => {
  const [studentsList, setStudentsList] = useState([]);

  const [showCreatedModalSuccess, setshowCreatedModalSuccess] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [fillClassAttendance, { isSuccess, isLoading, isError }] =
    useFillClassAttendanceMutation();

  const { classId } = useParams();

  useEffect(() => {
    if (students && students.length > 0) {
      setStudentsList(students);
    }
  }, [students]);

  useEffect(() => {
    if (isSuccess) {
      setshowCreatedModalSuccess(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  const changeStudentAttendance = (attended, studentId) => {
    const updatedStudentsList = studentsList.map((student) => {
      if (student._id === studentId) {
        const updatedAttendances = [...student.attendance];
        const attendanceDateIndex = student.attendance.findIndex(
          (x) => x.date.slice(0, 10) === selectedClassDate
        );
        if (attendanceDateIndex === -1) {
          console.log("xd");
          updatedAttendances.push({ attended, date: selectedClassDate });
        } else {
          updatedAttendances[attendanceDateIndex] = {
            ...updatedAttendances[attendanceDateIndex],
            attended: attended,
          };
        }
        return {
          ...student,
          attendance: updatedAttendances,
        };
      }
      return student;
    });

    console.log(updatedStudentsList);

    setStudentsList(updatedStudentsList);
  };

  const closeModal = () => {
    setStudentsList([]);
    close();
  };

  const onSubmitAttendace = () => {
    console.log("save attendance");
    fillClassAttendance({
      students: studentsList,
      classId,
      date: new Date(selectedClassDate),
    });
  };

  const studentsListContent = studentsList?.map((student) => {
    return (
      <tr key={student._id} className={styles.studentLine}>
        <td>{student.fullName}</td>
        <td>
          <AiOutlineCheck
            color="green"
            onClick={() => changeStudentAttendance(true, student._id)}
          />{" "}
          <AiOutlineClose
            color="red"
            onClick={() => changeStudentAttendance(false, student._id)}
          />
          {!student.attendance[
            student.attendance.findIndex(
              (x) => x.date.slice(0, 10) === selectedClassDate
            )
          ]?.attended
            ? "(no)"
            : "(yes)"}
        </td>

        {student.attendance[
          student.attendance.findIndex(
            (x) => x.date.slice(0, 10) === selectedClassDate
          )
        ]?.createdAt ? (
          <td>
            {stringDate(
              student.attendance[
                student.attendance.findIndex(
                  (x) => x.date.slice(0, 10) === selectedClassDate
                )
              ]?.createdAt
            )}
          </td>
        ) : (
          <td>-</td>
        )}
      </tr>
    );
  });
  return (
    <Modal show={show} onHide={close}>
      <div className={styles.attendanceFillModal}>
        <p style={{ fontWeight: "bold" }}>Class date {selectedClassDate}</p>
        <table className={styles.attendanceTable}>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Attended</th>
              <th>Submitted</th>
            </tr>
            {studentsListContent}
          </tbody>
        </table>
        <div className={styles.fillAttendanceButtons}>
          <button onClick={closeModal}>Close</button>
          <button onClick={onSubmitAttendace}>Save</button>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
      {isSuccess && (
        <CreatedModalSuccess
          message={"Class attendance was updated"}
          show={showCreatedModalSuccess}
          close={() => setshowCreatedModalSuccess(false)}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with filling attendance"}
        />
      )}
    </Modal>
  );
};

export default FillClassAttendance;
