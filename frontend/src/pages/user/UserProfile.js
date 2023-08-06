import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import UpdateProfile from "./UpdateProfile";
import styles from "./Profile.module.css";
import { useGetStudentProfileQuery } from "../../features/user/userService";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/spinner/Spinner";
import ErrorModal from "../../components/pop/ErrorModal";

const UserProfile = () => {
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const { email } = useParams();

  let user = null;

  const loggedUser = useSelector(selectCurrentUser);

  const { data, isSuccess, isLoading, isError } =
    useGetStudentProfileQuery(email);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  if (email === loggedUser.email) {
    user = loggedUser;
  }

  if (isSuccess) {
    user = data;
  }

  return (
    user && (
      <div className={styles.profile}>
        <div className={styles.studentInfo}>
          <div className={styles.studentInfoImage}>
            <img src={user.image.url} alt=""></img>
          </div>
          <div className={styles.studentInfoContent}>
            <div>
              <p>{user.role}</p>
            </div>
            <div>
              <h5>Email</h5>
              <p>{user.email}</p>
            </div>
            <div>
              <h5>Name</h5>
              <p>{user.fullName}</p>
            </div>
            <div>
              <h5>Address</h5>
              <p>{user.address}</p>
            </div>
          </div>
          {email === loggedUser.email && (
            <button
              onClick={() => setShowUpdateProfile(true)}
              className={styles.editProfileButton}
            >
              Edit
            </button>
          )}
        </div>
        {user && loggedUser.email === email && (
          <UpdateProfile
            show={showUpdateProfile}
            close={() => setShowUpdateProfile(false)}
            user={user}
          />
        )}
        {isLoading && <LoadingSpinner />}
        {isError && (
          <ErrorModal
            show={showErrorModal}
            close={() => setShowErrorModal(false)}
            message={"Problem with loading student profile data"}
          />
        )}
      </div>
    )
  );
};

export default UserProfile;
