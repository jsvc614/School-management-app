import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import SearchedStudents from "./SearchedStudents";
import LoadingSpinner from "../spinner/Spinner";
import { useSearchStudentsMutation } from "../../features/user/userService";
import ErrorModal from "../pop/ErrorModal";

const AddStudentPop = ({ show, close, selectedClass }) => {
  const [studentName, setStudentName] = useState("");

  const [showSearchResults, setShowSearchResults] = useState(false);

  const [searchError, setsearchError] = useState();

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [searchStudents, { data, isError, isLoading, isSuccess }] =
    useSearchStudentsMutation();

  useEffect(() => {
    if (isSuccess) {
      setShowSearchResults(true);
      setsearchError("");
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  const onSubmitSearch = (e) => {
    e.preventDefault();
    if (studentName.length > 0) {
      searchStudents(studentName);
    } else {
      setsearchError("Invalid search");
    }
  };

  console.log(selectedClass);

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Search student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmitSearch}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => setStudentName(e.target.value)}
              value={studentName}
            />
          </Form.Group>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button type="submit">Search</button>
            {searchError && <p style={{ color: "red" }}>{searchError}</p>}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
      {showSearchResults && (
        <SearchedStudents
          closeSearchModal={close}
          selectedClass={selectedClass}
          searchResults={data}
        />
      )}
      {isLoading && <LoadingSpinner />}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with searching"}
        />
      )}
    </Modal>
  );
};

export default AddStudentPop;
