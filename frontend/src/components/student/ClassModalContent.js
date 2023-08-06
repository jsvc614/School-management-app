import React, { useState } from "react";
import AddStudentPop from "./AddStudentPop";
import AddTestPop from "./AddTestPop";
import { useParams } from "react-router-dom";

const ClassModalContent = ({ show, close, modalName, selectedClass }) => {
  console.log(modalName);

  const { classname } = useParams();

  let content = (
    <AddStudentPop
      show={show}
      close={close}
      className={classname}
      selectedClass={selectedClass}
    />
  );

  if (modalName === "Asignment" || modalName === "Exam")
    content = (
      <AddTestPop
        show={show}
        close={close}
        className={classname}
        selectedClass={selectedClass}
        modalName={modalName}
      />
    );
  return content;
};

export default ClassModalContent;
