import React, { useEffect, useState } from "react";
import UpcomingTests from "../components/tests/UpcomingTests";
import styles from "./Dashboard.module.css";
import StudentsAttendance from "../components/dasboard/StudentsAttendance";
import StudentsResults from "../components/dasboard/StudentsResults";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import attendance from "../assets/attendance.jpeg";
import reportcard from "../assets/reportcard.jpeg";
import ContactUs from "../components/dasboard/ContactUs";
import { useGetScheduleQuery } from "../features/asignments/asignmentService";
import LoadingSpinner from "../components/spinner/Spinner";
import ErrorModal from "../components/pop/ErrorModal";

const Dashboard = () => {
  const user = useSelector(selectCurrentUser);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const { data, isLoading, isError } = useGetScheduleQuery();

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  let content = (
    <div className={styles.dashboardContainer}>
      <div className={styles.eventsContainer}>
        <UpcomingTests data={data} tests={true} />
        <UpcomingTests data={data} />
      </div>

      {user?.role === "TEACHER" ? (
        <div className={styles.teacherDash}>
          <StudentsAttendance />
          <StudentsResults />
          <ContactUs />
        </div>
      ) : (
        <div className={styles.studentDash}>
          <Link to={"/grades"}>
            <img src={reportcard} alt=""></img>
          </Link>
          <Link to={"/attendance"}>
            <img src={attendance} alt=""></img>
          </Link>
          <ContactUs />
        </div>
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with getting schedule"}
        />
      )}
    </div>
  );

  if (isLoading) {
    content = <LoadingSpinner />;
  }

  return content;
};

export default Dashboard;
