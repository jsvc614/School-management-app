import React, { useEffect, useRef, useState } from "react";
import styles from "./ContactUs.module.css";
import { useContactUsMutation } from "../../features/user/userService";
import CreatedModalSuccess from "../pop/CreatedModalSuccess";
import LoadingSpinner from "../spinner/Spinner";
import ErrorModal from "../pop/ErrorModal";

const ContactUs = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();

  const [errorMessage, setErrorMessage] = useState();

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [showCreatedModal, setShowCreatedModal] = useState();

  const [contactus, { isSuccess, isLoading, isError }] = useContactUsMutation();

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

  const onSubmitContactUsForm = (event) => {
    event.preventDefault();
    if (
      nameRef.current.value &&
      emailRef.current.value &&
      messageRef.current.value
    ) {
      contactus({
        name: nameRef.current.value,
        email: emailRef.current.value,
        message: messageRef.current.value,
      });
      nameRef.current.value = null;
      emailRef.current.value = null;
      messageRef.current.value = null;
    } else {
      setErrorMessage("All fields are required");
    }
  };

  return (
    <div className={styles.contactForm}>
      <form onSubmit={onSubmitContactUsForm}>
        <div className={styles.contactFormHeader}>
          <h1>Contact us</h1>
        </div>
        <input
          type="text"
          placeholder="Name"
          name="name"
          required
          ref={nameRef}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          ref={emailRef}
        />
        <textarea
          placeholder="Your message"
          name="message"
          required
          ref={messageRef}
        />
        <button type="submit" style={{ position: "relative" }}>
          Send{isLoading && <LoadingSpinner />}
        </button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {showCreatedModal && (
        <CreatedModalSuccess
          show={showCreatedModal}
          close={() => setShowCreatedModal(false)}
          message={"Thank you for contacting us!"}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with sending message to admin"}
        />
      )}
    </div>
  );
};

export default ContactUs;
