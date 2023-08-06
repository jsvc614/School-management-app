import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

import { useCreateNewClassMutation } from "../../features/class/classService";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import CreatedModalSuccess from "../../components/pop/CreatedModalSuccess";
import LoadingSpinner from "../../components/spinner/Spinner";
import ErrorModal from "../../components/pop/ErrorModal";

const date = new Date();
date.setDate(date.getDate() + 1);

const initialForm = {
  className: "",
  description: "",
  capacity: "25",
  startingDate: "",
  day: "",
  hour: "",
};

const NewClass = () => {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setformData] = useState(initialForm);

  const [showCreatedModal, setShowCreatedModal] = useState(false);

  const [addNewClass, { data, isLoading, isSuccess, isError }] =
    useCreateNewClassMutation();

  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);

  const onFormChange = (e) => {
    const keyToChange = e.target.name;
    setformData((existingValues) => ({
      ...existingValues,
      [keyToChange]: e.target.value,
    }));
  };

  const onCreateClass = async (e) => {
    e.preventDefault();
    await addNewClass({ ...formData, teacherEmail: user.email });
    setformData(initialForm);
  };

  useEffect(() => {
    if (isSuccess) {
      setShowCreatedModal(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  return (
    <Form onSubmit={onCreateClass}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Class name</Form.Label>
        <Form.Control
          type="text"
          name="className"
          onChange={onFormChange}
          value={formData.className}
          required
          minLength={4}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          onChange={onFormChange}
          value={formData.description}
          required
          minLength={10}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="">
        <Form.Label>Class capacity</Form.Label>
        <Form.Select
          aria-label="Default select example"
          name="capacity"
          onChange={onFormChange}
          value={formData.capacity}
        >
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="dob" className="mb-3">
        <Form.Label>Starting date</Form.Label>
        <Form.Control
          type="date"
          name="startingDate"
          min={date.toLocaleDateString("en-ca")}
          onChange={onFormChange}
          value={formData.startingDate}
        />
      </Form.Group>
      <Form.Group className="mb-3 " controlId="exampleForm.ControlTextarea1">
        <Form.Label style={{ marginRight: "1rem" }}>Schedule</Form.Label>
        <Form.Select
          className="mb-3"
          name="day"
          onChange={onFormChange}
          value={formData.day}
          required
        >
          <option disabled hidden value="">
            Select a day
          </option>
          <option value="1">Monday</option>
          <option value="2">Tuesday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
        </Form.Select>
        <Form.Select
          name="hour"
          onChange={onFormChange}
          value={formData.hour}
          required
        >
          <option disabled hidden value="">
            Select a hour
          </option>
          <option value="9">9</option>
          <option value="11">11</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
        </Form.Select>
      </Form.Group>
      <button type="submit">Create</button>
      {isLoading && <LoadingSpinner />}
      {showCreatedModal && (
        <CreatedModalSuccess
          message={data?.message}
          show={showCreatedModal}
          close={() => setShowCreatedModal(false)}
          navigate={() => navigate("/classes")}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem creating new class"}
        />
      )}
    </Form>
  );
};

export default NewClass;
