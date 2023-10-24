import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/auth/authService";
import Spinner from "../components/spinner/Spinner";
import { SocketContext } from "../context/socket";
import { useGetNotificationsQuery } from "../features/notifications/notificationsService";
import NotificationsList from "../components/notifications/NotificationsList";
import NavBar from "./NavBar";
import ErrorModal from "../components/pop/ErrorModal";

const Navigation = () => {
  const [notifications, setNotifications] = useState([]);

  const [showNotificationsList, setShowNotificationsList] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  // const user = useSelector(selectCurrentUser);

  const [logout, { isLoading }] = useLogoutMutation();

  const { data, isSuccess, isError } = useGetNotificationsQuery();

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (isSuccess) {
      setNotifications(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  useEffect(() => {
    const handleReceiveNotificationData = (data) => {
      setNotifications([...notifications, data]);
    };
    if (socket) {
      socket.on("receive_notification", handleReceiveNotificationData);

      return () => {
        socket.off("receive_notification", handleReceiveNotificationData);
      };
    }
  }, [socket, notifications]);

  const logoutUser = async () => {
    await logout();
    navigate("/");
  };

  const onShowNotifications = () => {
    setShowNotificationsList(true);
  };

  return (
    <>
      <NavBar
        notifications={notifications}
        onShowNotifications={onShowNotifications}
        logout={logoutUser}
      />
      {isLoading && <Spinner />}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with loading notifications"}
        />
      )}
      <NotificationsList
        notifications={notifications}
        show={showNotificationsList}
        close={() => setShowNotificationsList(false)}
      />
    </>
  );
};

export default Navigation;
