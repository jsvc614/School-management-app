import React, { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAddStudentMutation } from "../../features/class/classService";
import CreatedModalSuccess from "../pop/CreatedModalSuccess";
import { useNewNotificationMutation } from "../../features/notifications/notificationsService";
import { SocketContext } from "../../context/socket";
import LoadingSpinner from "../spinner/Spinner";
import ErrorModal from "../pop/ErrorModal";

const SearchedStudents = ({
  closeSearchModal,
  selectedClass,
  searchResults,
}) => {
  // const notiDataRef = useRef();

  const [showCreatedModal, setShowCreatedModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { classId } = useParams();

  const socket = useContext(SocketContext);

  const [
    addStudent,
    {
      data: dataAddStudent,
      isError: isErrorAddStudent,
      isSuccess: isSuccessAddStudent,
      error: errorAddStudent,
      isLoading: addStudentIsLoading,
    },
  ] = useAddStudentMutation();

  const [
    newNotification,
    { data: newNotificationData, isSuccess: isSuccessNewNotification },
  ] = useNewNotificationMutation();

  useEffect(() => {
    const sendNoti = () => {
      newNotification({
        users: [dataAddStudent.studentId],
        title: `You were added to class ${selectedClass.className}`,
        type: "class",
        ref: pathname,
      });
    };

    if (isSuccessAddStudent) {
      sendNoti();
    }
  }, [isSuccessAddStudent]);

  useEffect(() => {
    if (isErrorAddStudent) {
      setShowErrorModal(true);
    }
  }, [isErrorAddStudent]);

  useEffect(() => {
    if (isSuccessNewNotification) {
      setShowCreatedModal(true);
      socket.emit("send_notification", newNotificationData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessNewNotification, socket]);

  const moveTostudentProfile = (name) => {
    navigate(`/students/${name}`);
  };

  const closeCreateModal = () => {
    setShowCreatedModal(false);
    closeSearchModal();
  };

  const addStudentToClass = (e, studentId) => {
    e.stopPropagation();
    e.preventDefault();
    addStudent({ studentId, classId });
  };

  let searchedStudents;

  if (searchResults) {
    searchedStudents = searchResults.map((student) => {
      return (
        <Card
          key={student._id}
          style={{
            padding: "1rem",
            margin: "1rem",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            textAlign: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => moveTostudentProfile(student.fullName)}
        >
          <Card.Title>{student.fullName}</Card.Title>
          <button onClick={(e) => addStudentToClass(e, student._id)}>
            Add student to class
          </button>
        </Card>
      );
    });
  }

  return (
    <div>
      {isErrorAddStudent && (
        <p
          style={{
            color: "red",
            margin: "0 1rem 1rem 1rem",
            fontWeight: "bold",
          }}
        >
          {errorAddStudent.data.message}
        </p>
      )}
      {searchedStudents}
      {(!searchResults || searchResults?.length < 1) && (
        <h4 style={{ padding: "1rem" }}>There are not any results</h4>
      )}
      {addStudentIsLoading && <LoadingSpinner />}
      {isSuccessAddStudent && (
        <CreatedModalSuccess
          message={dataAddStudent?.message}
          show={showCreatedModal}
          close={closeCreateModal}
        />
      )}
      {showErrorModal && <ErrorModal />}
    </div>
  );
};

export default SearchedStudents;
