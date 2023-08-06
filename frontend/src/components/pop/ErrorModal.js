import React from "react";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";

const ErrorModal = ({ show, close, message }) => {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={close}
      style={{ alignItems: "center", textAlign: "center" }}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body
        style={{ margin: "0 auto", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        <AiOutlineClose color="red" fontSize={"40px"} fontWeight={"bolder"} />
        <p>{message}</p>
      </Modal.Body>
      <button onClick={close} style={{ width: "20%", margin: "1rem auto" }}>
        Close
      </button>
    </Modal>
  );
};

export default ErrorModal;
