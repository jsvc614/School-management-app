import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ClassPreview from "./ClassPreview";
import { selectCurrentUser } from "../../features/auth/authSlice";

import styles from "./ClassPreview.module.css";
import { selectCurrentClasses } from "../../features/class/classSlice";

const Classes = () => {
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);

  const classes = useSelector(selectCurrentClasses);

  let classesPreview;

  if (classes) {
    classesPreview = classes.map((c) => {
      return <ClassPreview key={c._id} data={c} />;
    });
  }

  const onAddClass = () => {
    navigate("/classes/new");
  };

  let content = (
    <div className={styles.classesPreviewList}>
      <h1>My classes</h1>
      <div className={styles.classList}>{classesPreview}</div>
      {user?.role === "TEACHER" && (
        <button onClick={onAddClass} className={styles.addClassButton}>
          Add class
        </button>
      )}
    </div>
  );

  return content;
};

export default Classes;
