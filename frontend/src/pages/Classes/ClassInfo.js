import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetClassByIdQuery } from "../../features/class/classService";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import ClassModalContent from "../../components/student/ClassModalContent";
import LoadingSpinner from "../../components/spinner/Spinner";
import styles from "./ClassInfo.module.css";
import Card from "react-bootstrap/Card";
import ErrorModal from "../../components/pop/ErrorModal";

const ClassInfo = () => {
  const { classId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);

  const user = useSelector(selectCurrentUser);

  const {
    data: currentClass,
    isLoading,
    isError: isErrorGetClass,
  } = useGetClassByIdQuery(classId);

  useEffect(() => {
    if (isErrorGetClass) {
      setShowErrorModal(true);
    }
  }, [isErrorGetClass]);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const handleClose = (e) => {
    setShowModal(false);
    setModalName("");
  };
  const handleShow = (e) => {
    const modalName = e.target.name;
    setModalName(modalName);
    setShowModal(true);
  };

  const moveTostudentProfile = (email) => {
    navigate(`/profile/${email}`);
  };

  const moveToAttendance = () => {
    navigate(`${pathname}/attendance`);
  };

  let students = currentClass?.students?.map((student) => (
    <Card
      key={student._id}
      className={styles.studentCard}
      onClick={() => moveTostudentProfile(student.email)}
    >
      <Card.Title>Student name: {student.fullName}</Card.Title>
      <Card.Subtitle>Email: {student.email}</Card.Subtitle>
    </Card>
  ));

  return (
    <div>
      <div className={styles.classInfoHeader}>
        <h1>{currentClass?.className} Class info</h1>
        {user?.role === "TEACHER" && (
          <div className={styles.teacherButtons}>
            <button onClick={handleShow} name="Student">
              + student
            </button>
            <button onClick={handleShow} name="Asignment">
              + asignment
            </button>
            <button onClick={handleShow} name="Exam">
              + exam
            </button>
          </div>
        )}
      </div>
      {students?.length > 0 && (
        <div className={styles.studentsList}>
          <div className={styles.classStudentsHeader}>
            <h5>Class students</h5>
            {user?.role === "TEACHER" && (
              <button onClick={moveToAttendance}>Attendance</button>
            )}
          </div>
          <div className={styles.studentCards}>{students}</div>
        </div>
      )}
      <button
        type="primary"
        onClick={() => navigate(`/classes/${classId}/asignments`)}
        name="student"
        style={{ marginTop: ".5rem" }}
      >
        Asignemnts
      </button>
      {showModal && (
        <ClassModalContent
          show={showModal}
          open={handleShow}
          close={handleClose}
          modalName={modalName}
          selectedClass={currentClass}
        />
      )}
      {isLoading && <LoadingSpinner />}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with getting class informations"}
        />
      )}
    </div>
  );
};

export default ClassInfo;
