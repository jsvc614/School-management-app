import React, { useEffect, useState } from "react";
import { useGetSubmittedAsignmentFilesQuery } from "../../../features/asignments/asignmentService";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import AsignmentMark from "../../../components/asignment/AsignmentMark";
import stringDate from "../../../utils/stringDate";
import LoadingSpinner from "../../../components/spinner/Spinner";
import styles from "./AsignmentSubmittedFiles.module.css";
import ErrorModal from "../../../components/pop/ErrorModal";

const AsignmentSubmittedFiles = () => {
  const { asignmentId } = useParams();

  const [showMarkingModal, setShowMarkingModal] = useState(false);

  const [studentToEvaluate, setStudentToEvaluate] = useState("");

  const [showErrorModal, setShowErrorModal] = useState(false);

  const { data, isLoading, isError } =
    useGetSubmittedAsignmentFilesQuery(asignmentId);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  const handleMarkAsignment = (student) => {
    setShowMarkingModal(true);
    setStudentToEvaluate(student);
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    setShowMarkingModal(false);
  };

  const submittedAsignments = data?.submittedStudents.map((student) => (
    <Card key={student._id} className={styles.submittedAsignmentCard}>
      <Card.Body className={styles.cardBody}>
        <p>Student name: {student.studentName}</p>
        <p>Submitted {stringDate(student.submittedAt)}</p>
        <a
          href={student.fileBase64}
          download={student.fileName}
          style={{ textDecoration: "none" }}
        >
          {student.fileName}
        </a>
      </Card.Body>
      <Card.Body
        style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
      >
        {student?.mark && (
          <>
            <p>Evalutated: {stringDate(student.evaluatedAt)}</p>
            <p>Points: {student.points}</p>
            <p>Mark: {student.mark}</p>
          </>
        )}
        <button onClick={() => handleMarkAsignment(student)}>
          {!student?.mark
            ? "Mark the assignment"
            : "Change asignment evaluation"}
        </button>
      </Card.Body>
    </Card>
  ));

  let content = (
    <div>
      <h1>Asignment: {data?.name}</h1>
      <div className={styles.submittedAsignments}> {submittedAsignments}</div>

      {
        <AsignmentMark
          showMarkModal={showMarkingModal}
          handleClose={handleClose}
          selectedStudent={studentToEvaluate}
          asignmentInfo={data}
        />
      }
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem getting submitted asignments"}
        />
      )}
    </div>
  );

  if (isLoading) {
    content = <LoadingSpinner />;
  }

  return content;
};

export default AsignmentSubmittedFiles;
