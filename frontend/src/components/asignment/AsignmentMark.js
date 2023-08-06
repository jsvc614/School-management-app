import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useMarkAsignmentMutation } from "../../features/asignments/asignmentService";
import CreatedModalSuccess from "../pop/CreatedModalSuccess";
import { SocketContext } from "../../context/socket";
import { useNewNotificationMutation } from "../../features/notifications/notificationsService";
import styles from "./AsignmentMark.module.css";
import LoadingSpinner from "../spinner/Spinner";
import ErrorModal from "../pop/ErrorModal";

const markDataInitialValues = {
  points: "",
  mark: "",
  teacherFeedback: "",
};

// const date = new Date(Date.now() - tzoffset).toISOString().slice(0, -8);

const AsignmentMark = ({
  showMarkModal,
  handleClose,
  selectedStudent,
  asignmentInfo,
}) => {
  const [markData, setMarkData] = useState(markDataInitialValues);

  const [showModalSucces, setShowModalSucces] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const socket = useContext(SocketContext);

  const [markAsignment, { data, isSuccess, isLoading, isError }] =
    useMarkAsignmentMutation();

  const [
    newNotification,
    { data: newNotificationData, isSuccess: isSuccessNewNotification },
  ] = useNewNotificationMutation();

  useEffect(() => {
    if (isSuccess) {
      setShowModalSucces(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccessNewNotification) {
      socket.emit("send_notification", newNotificationData);
    }
  }, [isSuccessNewNotification, socket, newNotificationData]);

  const handleMarkDataChange = (e) => {
    const { name, value } = e.target;

    setMarkData((prevMarkData) => ({
      ...prevMarkData,
      [name]: value,
    }));
  };

  const onSendEvaluation = (e) => {
    e.preventDefault();
    markAsignment({
      ...markData,
      studentName: selectedStudent.studentName,
      asignmentId: asignmentInfo._id,
      evaluatedAt: new Date(),
    });
    newNotification({
      users: [selectedStudent._id],
      title: `Evaluation from asignment ${asignmentInfo.name} has returned`,
      type: "asignment",
      ref: `/asignments/${asignmentInfo._id}/results`,
    });
    setMarkData(markDataInitialValues);
  };

  return (
    <Modal
      show={showMarkModal}
      onHide={handleClose}
      className={styles.asignmentMarkModal}
    >
      <Modal.Header
        closeButton
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div>
          {" "}
          <p style={{ fontSize: "20px" }}>{asignmentInfo?.name}</p>
          <p style={{ fontSize: "20px" }}>
            Student: {selectedStudent.studentName}
          </p>
        </div>
      </Modal.Header>
      <div style={{ padding: "1rem" }}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Points</Form.Label>
          <Form.Control
            type="number"
            max={asignmentInfo?.availablePoints}
            min={0}
            name="points"
            onChange={handleMarkDataChange}
            value={markData.points}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Mark</Form.Label>
          <Form.Control
            type="number"
            max={5}
            min={0}
            name="mark"
            onChange={handleMarkDataChange}
            value={markData.mark}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Feedback</Form.Label>
          <Form.Control
            type="text"
            name="teacherFeedback"
            onChange={handleMarkDataChange}
            value={markData.teacherFeedback}
          />
        </Form.Group>
      </div>
      <Modal.Footer>
        <button variant="secondary" onClick={handleClose}>
          Close
        </button>
        <button variant="primary" onClick={onSendEvaluation}>
          Send valuation{isLoading && <LoadingSpinner />}
        </button>
      </Modal.Footer>
      {showModalSucces && (
        <CreatedModalSuccess
          close={() => setShowModalSucces(false)}
          show={showModalSucces}
          message={data?.message}
          closeAsignmentMark={handleClose}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with asignment evaluation"}
        />
      )}
    </Modal>
  );
};

export default AsignmentMark;
