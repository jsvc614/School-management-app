import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import styles from "./ClassPreview.module.css";
import { BsFillArrowRightSquareFill } from "react-icons/bs";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ClassPreview = ({ data }) => {
  return (
    <Card
      className={styles.classCard}
      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
    >
      <div className={styles.classCardContent}>
        <div>
          <p>Class name: {data.className}</p>
          <p className={styles.classSchedule}>
            Schedule: {weekDays[data.lectureTime.day]}, {data.lectureTime.hour}
            :00
          </p>
        </div>
        <Link to={data._id} state={data} className={styles.moveButton}>
          <BsFillArrowRightSquareFill />
        </Link>
      </div>
    </Card>
  );
};

export default ClassPreview;
