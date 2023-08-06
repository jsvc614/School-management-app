import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "./Profile.module.css";
import { useEditProfileMutation } from "../../features/user/userService";
import CreatedModalSuccess from "../../components/pop/CreatedModalSuccess";
import { convertToBase64 } from "../../utils/convertToBase64";
import LoadingSpinner from "../../components/spinner/Spinner";
import ErrorModal from "../../components/pop/ErrorModal";

const UpdateProfile = ({ show, close, user }) => {
  const imageRef = useRef();
  const [userImage, setUserImage] = useState("");
  const [userImageName, setUserImageName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const emailRef = useRef(user.email);
  const addressRef = useRef(user.address);

  const [showCreatedModal, setshowCreatedModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (user && show) {
      emailRef.current.value = user.email;
      addressRef.current.value = user.address;
    }
  }, [user, show]);

  const [editProfile, { isSuccess, isLoading, isError }] =
    useEditProfileMutation();

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess) {
      setshowCreatedModal(true);
    }
  }, [isSuccess]);

  const handleUserImageChange = async (e) => {
    setUserImageName(e.target.files[0].name);

    const fileBase64 = await convertToBase64(e.target.files[0]);

    setUserImage(fileBase64);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      emailRef.current.value === user.email &&
      addressRef.current.value === user.address &&
      !userImage
    ) {
      setErrorMessage("You did not change any values");
    } else {
      editProfile({
        email: emailRef.current.value,
        address: addressRef.current.value,
        image: userImage,
      });
    }
  };

  const closeEditModal = () => {
    setUserImage("");
    setUserImageName("");
    setErrorMessage("");
    close();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={closeEditModal}
        className={styles.updateModalContainer}
      >
        <Modal.Header closeButton className={styles.updateModalHeader}>
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <div className={`${styles.updateModalBody} ${styles.image}`}>
          <img src={userImage ? userImage : user.image.url} alt=""></img>
          <div>
            <label onClick={() => imageRef.current.click()}>
              Change profile Picture
            </label>
            <p>{userImageName}</p>
          </div>
        </div>
        <div className={styles.updateModalBody}>
          <div className={styles.updateModalGroup}>
            <label>Email</label>
            <input type="text" ref={emailRef}></input>
          </div>
          <div className={styles.updateModalGroup}>
            <label>Address</label>
            <input type="text" ref={addressRef}></input>
          </div>
          <div className={styles.updateModalGroup} style={{ display: "none" }}>
            <input
              ref={imageRef}
              type="file"
              accept="image/"
              onChange={handleUserImageChange}
              required
            />
          </div>
          <button onClick={handleSubmit} className={styles.updateProfileButton}>
            Update profile
          </button>
        </div>
        {errorMessage && (
          <p style={{ color: "red", margin: "0 0 1rem 1rem" }}>
            {errorMessage}
          </p>
        )}
        {isLoading && <LoadingSpinner />}
        {showCreatedModal && (
          <CreatedModalSuccess
            message={"Profile was edited"}
            show={showCreatedModal}
            close={() => setshowCreatedModal(false)}
          />
        )}
        {showErrorModal && (
          <ErrorModal
            show={showErrorModal}
            close={() => setShowErrorModal(false)}
            message={"Problem with editing profile"}
          />
        )}
      </Modal>
    </>
  );
};

export default UpdateProfile;
