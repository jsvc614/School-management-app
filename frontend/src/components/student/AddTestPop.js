import React, { useContext, useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import CreatedModalSuccess from "../pop/CreatedModalSuccess";
import { useLocation } from "react-router-dom";
import {
  useAddTestMutation,
  useEditTestMutation,
} from "../../features/asignments/asignmentService";
import { useNewNotificationMutation } from "../../features/notifications/notificationsService";
import { SocketContext } from "../../context/socket";
import LoadingSpinner from "../spinner/Spinner";
import ErrorModal from "../pop/ErrorModal";

const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const date = new Date(Date.now() - tzoffset).toISOString().slice(0, -8);

const AddTestPop = ({
  show,
  close,
  asignment,
  selectedClass,
  modalName,
  edit,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [showErrorModal, setshowErrorModal] = useState({
    modal: false,
    message: "",
  });

  const nameRef = useRef();
  const descriptionRef = useRef();
  const availablePointsRef = useRef();
  const submissionDateRef = useRef();

  const [showCreatedModal, setShowCreatedModal] = useState(false);

  const [addTest, { data, isSuccess, isLoading, isError, error }] =
    useAddTestMutation();

  const [
    editTest,
    {
      data: editData,
      isSuccess: isEditDataSuccess,
      isLoading: isLoadingEditTest,
      isError: isErrorEditTest,
    },
  ] = useEditTestMutation();

  const [
    newNotification,
    { data: newNotificationData, isSuccess: isSuccessNewNotification },
  ] = useNewNotificationMutation();

  const socket = useContext(SocketContext);

  const { pathname } = useLocation();

  useEffect(() => {
    if (isSuccess) {
      nameRef.current.value = "";
      descriptionRef.current.value = "";
      availablePointsRef.current.value = "";
      submissionDateRef.current.value = "";
      setShowCreatedModal(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isEditDataSuccess || isErrorEditTest) {
      setShowCreatedModal(true);
    }
  }, [isEditDataSuccess, isErrorEditTest]);

  useEffect(() => {
    if (isError || isErrorEditTest) {
      if (isError) {
        setshowErrorModal({
          modal: true,
          message: "Problem with adding new test",
        });
      }
      if (isErrorEditTest) {
        setshowErrorModal({
          modal: true,
          message: "Problem with editing test",
        });
      }
    }
  }, [isError, isErrorEditTest]);

  useEffect(() => {
    if (asignment) {
      nameRef.current.value = asignment.name;
      descriptionRef.current.value = asignment.description;
      availablePointsRef.current.value = asignment.availablePoints;
      submissionDateRef.current.value = asignment.submissionDate.slice(0, 16);
    }
  }, [asignment]);

  useEffect(() => {
    if (isSuccessNewNotification) {
      socket.emit("send_notification", newNotificationData);
    }
  }, [isSuccessNewNotification, socket, newNotificationData]);

  const onNewTest = (e) => {
    e.preventDefault();
    const asignmentForm = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      availablePoints: availablePointsRef.current.value,
      submissionDate: submissionDateRef.current.value,
      testType: modalName.toUpperCase(),
      classId: selectedClass._id,
    };
    console.log(asignmentForm);
    addTest(asignmentForm);
    newNotification({
      users: selectedClass.students.map((student) => student._id),
      title: `New asignment in class ${selectedClass.className}`,
      type: "asignment",
      ref: `${pathname}/asignments`,
    });
  };

  const onEditTest = (e) => {
    e.preventDefault();
    if (
      nameRef.current.value === asignment.name &&
      descriptionRef.current.value === asignment.description &&
      availablePointsRef.current.value ===
        asignment.availablePoints.toString() &&
      submissionDateRef.current.value === asignment.submissionDate.slice(0, 16)
    ) {
      setErrorMessage("You did not change any values");
    } else {
      const asignmentForm = {
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        availablePoints: availablePointsRef.current.value,
        submissionDate: submissionDateRef.current.value,
        asignmentId: asignment._id,
      };
      editTest(asignmentForm);
      newNotification({
        users: selectedClass.students.map((student) => student._id),
        title: `Asignment ${asignmentForm.name} in class ${selectedClass.className} was changed`,
        type: "asignment",
        ref: pathname,
      });
      setShowCreatedModal(true);
    }
  };

  const closeCreateModal = () => {
    setShowCreatedModal(false);
    close();
  };

  return (
    <Modal show={show} onHide={close} onSubmit={!edit ? onNewTest : onEditTest}>
      <Modal.Header closeButton>
        <Modal.Title>
          {edit ? `Edit ${modalName}` : `New ${modalName}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="name" ref={nameRef}></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="textarea"
              name="description"
              ref={descriptionRef}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Available points</Form.Label>
            <Form.Control
              type="number"
              name="availablePoints"
              ref={availablePointsRef}
              min={1}
              max={100}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Submission date</Form.Label>
            <Form.Control
              type="datetime-local"
              min={date}
              ref={submissionDateRef}
              name="submissionDate"
            ></Form.Control>
          </Form.Group>
          <button type="submit">
            {asignment ? "Save changes" : "Create asignment"}
          </button>
        </Form>
        {isError && <p style={{ color: "red" }}>{error?.data.message}</p>}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </Modal.Body>
      {isLoading && <LoadingSpinner />}
      {isLoadingEditTest && <LoadingSpinner />}
      {showCreatedModal && (
        <CreatedModalSuccess
          show={showCreatedModal}
          message={data?.message || editData?.message}
          close={closeCreateModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setshowErrorModal({ modal: false, message: "" })}
          message={showErrorModal.message}
        />
      )}
    </Modal>
  );
};

export default AddTestPop;
