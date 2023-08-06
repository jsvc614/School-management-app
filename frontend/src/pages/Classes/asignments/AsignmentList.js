import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { convertToBase64 } from "../../../utils/convertToBase64";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../features/auth/authSlice";
import {
  useGetTestsQuery,
  useRemoveTestMutation,
  useSendAsignmentMutation,
} from "../../../features/asignments/asignmentService";
import stringDate from "../../../utils/stringDate";
import AddTestPop from "../../../components/student/AddTestPop";
import { SocketContext } from "../../../context/socket";
import { useNewNotificationMutation } from "../../../features/notifications/notificationsService";
import styles from "./AsignmentList.module.css";
import LoadingSpinner from "../../../components/spinner/Spinner";
import ConfirmationModal from "../../../components/pop/ConfirmationModal";
import CreatedModalSuccess from "../../../components/pop/CreatedModalSuccess";
import ErrorModal from "../../../components/pop/ErrorModal";

const AsignmentList = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState({
    show: false,
    asignemntId: "",
  });

  const [fileInfo, setFileInfo] = useState({
    file: "",
    asignmentId: "",
    fileName: "",
  });

  const [editAsignment, setEditAsignment] = useState({
    modal: false,
    asignment: "",
  });

  const [createdModalSuccess, setCreatedModalSuccess] = useState({
    modal: false,
    message: "",
  });

  const [showErrorModal, setShowErrroModal] = useState({
    modal: false,
    message: "",
  });

  const [inputErrorMessage, setInputErrorMessage] = useState("");

  const { classId } = useParams();

  const user = useSelector(selectCurrentUser);

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { data, isLoading, isError } = useGetTestsQuery(classId);

  const socket = useContext(SocketContext);

  const [
    sendAsignment,
    {
      data: sendAsignmentData,
      isSuccess: sendAsignmentIsSuccess,
      isLoading: isLoadingSend,
      isError: isErrorSendAsignemnt,
    },
  ] = useSendAsignmentMutation();

  const [
    removeAsignment,
    {
      data: removeAsignmentData,
      isSuccess: removeAsignmentIsSuccess,
      isLoading: isLoadingRemove,
      isError: isErrorRemoveAsignment,
    },
  ] = useRemoveTestMutation();

  useEffect(() => {
    if (isError || isErrorSendAsignemnt || isErrorRemoveAsignment) {
      if (isError) {
        setShowErrroModal({
          modal: true,
          message: "Problem with getting tests",
        });
      }
      if (isErrorSendAsignemnt) {
        setShowErrroModal({
          modal: true,
          message: "Problem with sending asignment",
        });
      }
      if (isErrorRemoveAsignment) {
        setShowErrroModal({
          modal: true,
          message: "Problem with removing asignment",
        });
      }
    }
  }, [isError, isErrorSendAsignemnt, isErrorRemoveAsignment]);

  const [
    newNotification,
    { data: newNotificationData, isSuccess: isSuccessNewNotification },
  ] = useNewNotificationMutation();

  useEffect(() => {
    if (isSuccessNewNotification) {
      socket.emit("send_notification", newNotificationData);
    }
  }, [isSuccessNewNotification, newNotificationData, socket]);

  useEffect(() => {
    if (sendAsignmentIsSuccess) {
      const { message } = sendAsignmentData;
      if (fileInfo.asignmentId) {
        document.getElementById(fileInfo.asignmentId).value = "";
      }
      setCreatedModalSuccess({
        modal: true,
        message: message,
      });
      setFileInfo({
        file: "",
        asignmentId: "",
        fileName: "",
      });
    }
    // eslint-disable-next-line
  }, [sendAsignmentIsSuccess, sendAsignmentData]);

  useEffect(() => {
    if (removeAsignmentIsSuccess) {
      const { message } = removeAsignmentData;
      setCreatedModalSuccess({
        modal: true,
        message: message,
      });
    }
  }, [removeAsignmentIsSuccess, removeAsignmentData]);

  const handleFileChange = (e, asignmentId) => {
    const file = e.target.files[0];
    if (file) {
      setFileInfo({ file, asignmentId, fileName: file.name });
    }
  };

  const sendAsignmentFile = async (e, asignment) => {
    e.preventDefault();
    if (fileInfo.file) {
      const fileBase64 = await convertToBase64(fileInfo.file);
      sendAsignment({
        _id: user.id,
        fileBase64,
        asignmentId: fileInfo.asignmentId,
        fileName: fileInfo.fileName,
        submittedAt: new Date(),
      });

      newNotification({
        users: [data.class.teacher],
        title: `Student ${user.fullName} submitted asignment: ${asignment.name} `,
        type: "asignment",
        ref: `${pathname}/${asignment._id}/submitted`,
      });
      setInputErrorMessage(false);
    } else {
      setInputErrorMessage(e.target.name);
    }
  };

  const handleEditAsignment = (asignment) => {
    setEditAsignment({ modal: true, asignment });
  };

  const handleRemoveAsignment = () => {
    removeAsignment(showConfirmationModal.asignemntId);
  };

  const onViewSubmittedfiles = (asignemntId, asignmentName) => {
    navigate(`/classes/${classId}/asignments/${asignemntId}/submitted`);
  };

  const showResults = (asignemntId, asignment) => {
    navigate(`/asignments/${asignemntId}/results`);
  };

  const handleShowConfirmationModal = (asignemntId) => {
    setShowConfirmationModal({ show: true, asignemntId });
  };

  const activeAsignments = data?.asignments
    ?.filter((asignment) => asignment.active)
    .map((asignment) => {
      return (
        <Card key={asignment._id} className={styles.TestCard}>
          <Card.Title
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <h4 style={{ maxWidth: "85%" }}>{asignment.name}</h4>
            {user?.role === "TEACHER" && (
              <span
                onClick={() => handleShowConfirmationModal(asignment._id)}
                className={styles.removeButton}
              >
                +
              </span>
            )}
          </Card.Title>

          <Card.Body
            style={{
              padding: "0",
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
            }}
          >
            <div>
              <h5>Description</h5>
              <p>{asignment.description}</p>
            </div>
            <div>
              <h5>Available points</h5> <p>{asignment.availablePoints}</p>
            </div>
          </Card.Body>
          <div className={styles.submitUntilText}>
            Submit until {stringDate(asignment.submissionDate)}
          </div>
          {user?.role === "STUDENT" && (
            <>
              <input
                type="file"
                id={asignment._id}
                className={styles.fileInput}
                name="filename"
                onChange={(e) => handleFileChange(e, asignment._id)}
              />
              <button
                onClick={(e) => sendAsignmentFile(e, asignment)}
                name={asignment._id}
              >
                Submit file
              </button>
            </>
          )}
          {user?.role === "TEACHER" && (
            <div className={styles.teacherButtons}>
              <button
                onClick={() =>
                  onViewSubmittedfiles(asignment._id, asignment.name)
                }
              >
                View Submitted files
              </button>
              <button onClick={() => handleEditAsignment(asignment)}>
                Edit
              </button>
            </div>
          )}

          {inputErrorMessage && inputErrorMessage === asignment._id && (
            <p
              style={{
                color: "red",
                display: "inline-block",
                marginLeft: "1rem",
              }}
            >
              You have to choose file
            </p>
          )}
          {user?.role === "STUDENT" && (
            <div className={styles.results}>
              <div
                style={{
                  background: "#f3f3f3",
                  padding: ".5rem 1rem",
                  margin: "0 -1rem",
                }}
              >
                {asignment?.submittedStudent ? (
                  <div
                    style={{
                      display: "flex",
                      gap: ".5rem",
                      flexDirection: "column",
                    }}
                  >
                    <p className={styles.fileName}>
                      {`Submitted file: ${asignment?.submittedStudent.fileName}`}
                    </p>
                  </div>
                ) : (
                  <p>You have not submitted file yet</p>
                )}
              </div>
              {user?.role === "STUDENT" && (
                <button
                  className={styles.showResults}
                  onClick={() => showResults(asignment._id, asignment)}
                >
                  Show results
                </button>
              )}
            </div>
          )}
        </Card>
      );
    });

  return (
    <>
      {data?.asignments.length < 1 && (
        <div className={styles.noAsignments}>
          <h2>Asignments</h2>
          <div>No Asignments yet</div>
          <button onClick={() => navigate(`/classes/${data?.class._id}`)}>
            Back to classes
          </button>
        </div>
      )}
      <div className={styles.asignmentsContainer}>
        {activeAsignments}
        {(isLoadingRemove || isLoadingSend || isLoading) && <LoadingSpinner />}
        {editAsignment.modal && (
          <AddTestPop
            show={editAsignment.modal}
            close={() => setEditAsignment({ modal: false, asignment: "" })}
            asignment={editAsignment.asignment}
            selectedClass={data.class}
            modalName={`Asignment`}
            edit={true}
          />
        )}
      </div>
      {createdModalSuccess && (
        <CreatedModalSuccess
          message={createdModalSuccess.message}
          show={createdModalSuccess.modal}
          close={() => setCreatedModalSuccess({ modal: false, message: "" })}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal.modal}
          message={showErrorModal.message}
          close={() => setShowErrroModal({ modal: false, message: "" })}
        />
      )}
      <ConfirmationModal
        show={showConfirmationModal.show}
        handleClose={() =>
          setShowConfirmationModal({ show: false, asignemntId: "" })
        }
        content={"Do you really want to remove this test?"}
        removeAsignment={handleRemoveAsignment}
      />
    </>
  );
};

export default AsignmentList;
