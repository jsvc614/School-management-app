import React from "react";
import Modal from "react-bootstrap/Modal";

const ConfirmationModal = ({ show, handleClose, content, removeAsignment }) => {
  const handleDelete = () => {
    handleClose();
    removeAsignment();
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ fontSize: "20px" }}>{content}</Modal.Body>
      <Modal.Footer>
        <button onClick={handleClose}>Cancel</button>
        <button style={{ background: "red" }} onClick={handleDelete}>
          Delete
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
