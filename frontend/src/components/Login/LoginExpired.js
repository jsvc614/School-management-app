import React from "react";
import { Link } from "react-router-dom";
import styles from "./LoginExpired.module.css";

const LoginExpired = ({ message }) => {
  return (
    <div className={styles.loginExpired}>
      <p>{message}</p>
      <Link to="/login">Please login again</Link>
    </div>
  );
};

export default LoginExpired;
