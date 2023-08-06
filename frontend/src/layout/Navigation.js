import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/auth/authService";
import Spinner from "../components/spinner/Spinner";
import navClasses from "./Navigation.module.css";
import { SocketContext } from "../context/socket";
import { useGetNotificationsQuery } from "../features/notifications/notificationsService";
import NotificationsList from "../components/notifications/NotificationsList";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
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
    navigate("/login");
  };

  const onShowNotifications = () => {
    setShowNotificationsList(true);
  };

  return (
    <>
      <NavBar
        badge={
          <Badge
            onClick={onShowNotifications}
            badgeContent={notifications?.filter((noti) => !noti.read).length}
            className={navClasses.notificationIcon}
          >
            <span className={navClasses.notificationTooltip}>
              Show notifications
            </span>
            <MailIcon />
          </Badge>
        }
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
