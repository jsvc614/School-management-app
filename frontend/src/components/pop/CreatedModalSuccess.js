import React from "react";
import Modal from "react-bootstrap/Modal";
import { AiOutlineCheck } from "react-icons/ai";

const CreatedModalSuccess = ({
  message,
  close,
  show,
  closeAsignmentMark,
  navigate,
}) => {
  const handleCloseModal = () => {
    close();
    if (navigate) {
      navigate();
    }

    if (closeAsignmentMark) {
      closeAsignmentMark();
    }
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleCloseModal}
      style={{ alignItems: "center", textAlign: "center" }}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body
        style={{ margin: "0 auto", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        <AiOutlineCheck color="green" fontSize={"40px"} fontWeight={"bolder"} />
        <p> {message}</p>
      </Modal.Body>
      <button
        onClick={handleCloseModal}
        style={{ width: "20%", margin: "1rem auto" }}
      >
        Close
      </button>
    </Modal>
  );
};

export default CreatedModalSuccess;
