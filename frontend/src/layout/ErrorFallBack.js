import React from "react";
import styles from "./ErrorFallBack.module.css";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className={styles.errorFallBack}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Back home</button>
    </div>
  );
};
export default ErrorFallback;
