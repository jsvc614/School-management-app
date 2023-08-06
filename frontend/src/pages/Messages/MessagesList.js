import React, { useEffect, useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import styles from "./Messages.module.css";
import Messages from "./Messages";
import { useGetMessagesQuery } from "../../features/messages/messagesService";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import Spinner from "../../components/spinner/Spinner";
import { v4 as uuidv4 } from "uuid";
import NewMessage from "./NewMessage";
import { format } from "timeago.js";
import ErrorModal from "../../components/pop/ErrorModal";

const MessagesList = () => {
  const [selectedChatter, setSelectedChatter] = useState();

  const effectRunRef = useRef(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState();

  const [leftPanelMessages, setLeftPanelMessages] = useState([]);

  const [newMessage, setNewMessage] = useState(false);

  const currentUser = useSelector(selectCurrentUser);

  const {
    data: messeges,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetMessagesQuery();

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && messeges.length > 0 && !effectRunRef.current) {
      if (!messeges[0].recipientGroupInfo) {
        setSelectedChatter(
          messeges[0].other === messeges[0].fromUser
            ? messeges[0].fromUserInfo
            : messeges[0].recipientInfo
        );
      } else {
        setSelectedGroup(messeges[0].recipientGroupInfo);
      }
      effectRunRef.current = true;
    }
    setLeftPanelMessages(messeges);
  }, [isSuccess, messeges, windowWidth]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  const chatWithUser = (chatter) => {
    if (chatter.name) {
      setSelectedGroup(chatter);
      setSelectedChatter(null);
    } else {
      setSelectedChatter(chatter);
      setSelectedGroup(null);
    }
    setNewMessage(false);
  };

  const onNewMessage = () => {
    setNewMessage(true);
    setSelectedChatter(null);
    setSelectedGroup(null);
  };

  const closeNewMessage = (chatter) => {
    setNewMessage(false);
    if (chatter && leftPanelMessages[0].recipientGroupInfo) {
      setSelectedGroup(leftPanelMessages[0].recipientGroupInfo);
    }
    if (chatter && !leftPanelMessages[0].recipientGroupInfo) {
      setSelectedChatter(
        leftPanelMessages[0].fromUserInfo._id === leftPanelMessages[0].me
          ? leftPanelMessages[0].recipientInfo
          : leftPanelMessages[0].fromUserInfo
      );
    }
  };

  const onSelect = (user, group) => {
    setSelectedChatter(user);
    setSelectedGroup(group);
  };

  // const updateMessageLeftPanel = (message, chatOn) => {
  //   let newState;

  //   console.log(message, "////////messsage");

  //   let isMsgLeftSide = false;

  //   console.log("x");
  //   newState = leftPanelMessages
  //     ?.map((msg) => {
  //       if (
  //         msg.fromUser === message.fromUser &&
  //         msg.recipient === message.recipient
  //       ) {
  //         isMsgLeftSide = true;

  //         return {
  //           ...msg,
  //           message: message.message,
  //           createdAt: message.createdAt,
  //           read: !chatOn
  //             ? { marked: false }
  //             : { marked: true, date: new Date() },
  //         };
  //       }
  //       if (
  //         msg.fromUser === message.recipient &&
  //         msg.recipient === message.fromUser
  //       ) {
  //         isMsgLeftSide = true;
  //         return {
  //           ...msg,
  //           message: message.message,
  //           createdAt: message.createdAt,
  //           fromUser: message.fromUser,
  //           recipient: message.recipient,
  //           fromUserInfo: msg.recipientInfo,
  //           recipientInfo: msg.fromUserInfo,
  //           read: !chatOn
  //             ? { marked: false }
  //             : { marked: true, date: new Date() },
  //         };
  //       }
  //       if (
  //         msg.recipientGroupInfo?.users.every((element) => {
  //           return message.recipientGroupInfo?.users.includes(element);
  //         })
  //       ) {
  //         isMsgLeftSide = true;
  //         return {
  //           ...msg,
  //           message: message.message,
  //           createdAt: message.createdAt,
  //           fromUserInfo: message.fromUserInfo,
  //           fromUser: message.fromUser,
  //         };
  //       }
  //       if (msg.recipientGroupInfo?.name === message.recipientName) {
  //         isMsgLeftSide = true;
  //         return {
  //           ...msg,
  //           message: message.message,
  //           createdAt: message.createdAt,
  //           fromUser: message.fromUser,
  //           fromUserInfo: {
  //             _id: message.fromUser,
  //             fullName: message.fromUserName,
  //           },
  //         };
  //       }
  //       return msg;
  //     })
  //     .sort(
  //       (date1, date2) =>
  //         new Date(date2.createdAt).getTime() -
  //         new Date(date1.createdAt).getTime()
  //     );

  //   if (!isMsgLeftSide) {
  //     console.log("addint to left side panel");
  //     newState = leftPanelMessages
  //       .concat(message)
  //       .sort(
  //         (date1, date2) =>
  //           new Date(date2.createdAt).getTime() -
  //           new Date(date1.createdAt).getTime()
  //       );
  //   }

  //   setLeftPanelMessages(newState);
  // };

  // const updateMessageReadLeftSidePanel = (message) => {
  //   console.log(message, "////////messsage");

  //   // const nextLeftPanelMessages = [...leftPanelMessages];

  //   // const foundMessage = nextLeftPanelMessages?.find(
  //   //   (element) =>
  //   //     element.fromUser === message.fromUser &&
  //   //     element.recipient === message.recipient
  //   // );

  //   // if (!foundMessage.read.marked) {

  //   // }
  //   setLeftPanelMessages(
  //     leftPanelMessages.map((element) => {
  //       if (
  //         element.fromUser === message.fromUser &&
  //         element.recipient === message.recipient
  //       ) {
  //         return {
  //           ...element,
  //           read: { marked: true, date: message.read.date },
  //         };
  //       } else {
  //         return element;
  //       }
  //     })
  //   );
  // };

  // console.log(leftPanelMessages);

  let recipientName = "";
  if (selectedGroup && !selectedGroup.name) {
    console.log(selectedGroup);
    selectedGroup.forEach((group) => {
      recipientName += group.fullName + " ";
    });
    recipientName += currentUser.fullName;
  }
  if (selectedGroup && selectedGroup.name) {
    recipientName = selectedGroup.name;
  }

  const userLeftPanelMessages = leftPanelMessages?.map((messege) => (
    <Card
      onClick={() =>
        chatWithUser(
          messege.other === messege.fromUser
            ? messege.fromUserInfo
            : messege.recipientInfo || messege.recipientGroupInfo
        )
      }
      className={styles.leftSideUser}
      key={uuidv4()}
    >
      {messege.recipientGroupInfo?.name || messege.fromUserName ? (
        <>
          <Card.Title style={{ fontSize: "20px" }}>
            {messege.recipientGroupInfo?.name || messege.recipientName}
          </Card.Title>
          <p>{messege.fromUserInfo?.fullName || messege.fromUserName}</p>
        </>
      ) : (
        <Card.Title style={{ margin: "0" }}>
          {messege.recipientName === currentUser.fullName
            ? messege.senderName
            : messege.recipientName ||
              (messege.other === messege.fromUser
                ? messege.fromUserInfo?.fullName
                : messege.recipientInfo?.fullName)}
        </Card.Title>
      )}
      {windowWidth > 800 && (
        <Card.Body
          style={{
            padding: "0",
            maxHeight: "100px",
            maxWidth: "100%",
            flexShrink: "1",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {messege?.fromUser === currentUser?.id ? (
            <p>Vy: {messege?.message}</p>
          ) : (
            <p style={{ fontWeight: !messege.read.marked && "bold" }}>
              {messege?.message}
            </p>
          )}

          <p style={{ color: "gray" }}>{format(messege.createdAt)}</p>
        </Card.Body>
      )}
    </Card>
  ));
  let content = (
    <div className={styles.chat}>
      <div className={styles.chatUsers}>
        <div className={styles.lefSidePanelHeader}>
          <h2>Chat</h2>
          <button onClick={onNewMessage} style={{ fontSize: "20px" }}>
            New
          </button>
        </div>

        {userLeftPanelMessages}
      </div>

      <div className={styles.chatMessages}>
        {newMessage ? (
          <NewMessage closeNewMessage={closeNewMessage} select={onSelect} />
        ) : (
          <div className={styles.chatterName}>
            {selectedGroup || selectedChatter ? (
              <h3>
                {selectedChatter?.fullName ||
                  selectedGroup?.name ||
                  recipientName}
              </h3>
            ) : (
              <h3>
                {newMessage.usersTo?.map((userTo) => (
                  <span key={userTo._id}>{userTo.fullName}</span>
                ))}
              </h3>
            )}
          </div>
        )}

        {(!newMessage.show || selectedChatter) && (
          <Messages
            selectedChatter={selectedChatter}
            closeNewMessageAfterMsg={closeNewMessage}
            selectedGroup={selectedGroup}
            recipientGroupName={recipientName}
            refetch={refetch}
          />
        )}
      </div>
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with finding user"}
        />
      )}
    </div>
  );

  if (isLoading) {
    content = <Spinner />;
  }

  return content;
};

export default MessagesList;
