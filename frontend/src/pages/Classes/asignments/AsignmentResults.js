import React from "react";
import { useParams } from "react-router-dom";
import { useGetAsignmentResultsQuery } from "../../../features/asignments/asignmentService.js";
import LoadingSpinner from "../../../components/spinner/Spinner.js";

const AsignmentResults = () => {
  const { asignmentId } = useParams();

  const { data, isSuccess, isLoading } =
    useGetAsignmentResultsQuery(asignmentId);

  let content = <div>There are no results yet!</div>;

  if (isLoading) {
    content = <LoadingSpinner />;
  }
  if (isSuccess && data?.submittedStudents[0].points) {
    content = (
      <div>
        <div>
          <h1>{data?.name} Results</h1>
        </div>
        <div>
          <h3>Mark</h3>
          <p>{data?.submittedStudents[0]?.mark}</p>
        </div>
        <div>
          <h3>Points</h3>
          <p>
            {data?.submittedStudents[0]?.points}/{data?.availablePoints}
          </p>
        </div>
        <div>
          <h3>Feedback</h3>
          <p>{data?.submittedStudents[0]?.teacherFeedback}</p>
        </div>
      </div>
    );
  }
  return content;
};

export default AsignmentResults;
