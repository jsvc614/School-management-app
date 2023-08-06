import Card from "react-bootstrap/Card";

import React from "react";
import { useGetStudentsByClassQuery } from "../features/user/userService";
import { useNavigate } from "react-router-dom";

const useGetClassStudents = (classId) => {
  const { data, isError, isSuccess } = useGetStudentsByClassQuery(classId);

  const navigate = useNavigate();

  const moveTostudentProfile = (studentName) => {
    navigate(`/students/${studentName}`);
  };

  let students;
  if (data && isSuccess) {
    students = data.map((student) => (
      <Card
        key={student._id}
        style={{ margin: "1rem 0 ", padding: ".5rem", cursor: "pointer" }}
        onClick={() => moveTostudentProfile(student.fullName)}
      >
        <Card.Title>Student name: {student.fullName}</Card.Title>
        <Card.Subtitle>Email: {student.email}</Card.Subtitle>
      </Card>
    ));
  }
  return students;
};

export default useGetClassStudents;
