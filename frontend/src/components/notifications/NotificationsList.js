import React from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useUserReadNotificationMutation } from "../../features/notifications/notificationsService";
import styles from "./NotificationsList.module.css";

const NotificationsList = ({ notifications, show, close }) => {
  const navigate = useNavigate();

  const [userReadNotification, {}] = useUserReadNotificationMutation();

  const onSelectNotification = (pathname, id) => {
    userReadNotification(id);
    navigate(pathname);
    close();
  };

  const notificationsContent = notifications?.map((notification, index) => {
    return (
      <div
        onClick={() => onSelectNotification(notification.ref, notification._id)}
        className={styles.notificationsContainer}
        key={notification._id}
      >
        <div className={notification.read ? styles.read : styles.unread}>
          {index + 1}. {notification.title}
        </div>
      </div>
    );
  });

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={close}
      style={{
        padding: "0",
        margin: "0",
        maxHeight: "80vh",
        top: "50%",
      }}
    >
      <Modal.Header closeButton>
        <h2>Notifications</h2>
      </Modal.Header>
      <Modal.Body
        style={{
          padding: "0",
          fontWeight: "bold",
          fontSize: "1.5rem",
          width: "100%",
        }}
      >
        {notificationsContent}
      </Modal.Body>
    </Modal>
  );
};

export default NotificationsList;
