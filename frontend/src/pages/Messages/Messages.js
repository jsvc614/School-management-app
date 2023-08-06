import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import styles from "./Messages.module.css";
import {
  useGetMessagesForGroupQuery,
  useGetMessagesWithSpecificUserQuery,
  useSendMessageToApiMutation,
  useUserReadMessageMutation,
} from "../../features/messages/messagesService";
import { SocketContext } from "../../context/socket";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import LoadingSpinner from "../../components/spinner/Spinner";
import { RiSendPlane2Fill } from "react-icons/ri";
import ErrorModal from "../../components/pop/ErrorModal";

function Messages({
  selectedChatter,
  // updateMessageLeftPanel,
  closeNewMessageAfterMsg,
  selectedGroup,
  recipientGroupName,
  // updateMessageReadLeftSidePanel,
  refetch,
}) {
  const [messages, setMessages] = useState([]);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [newMessage, setNewMessage] = useState("");

  const [receivedMessage, setReceivedMessage] = useState(null);

  const [messageToSend, setMessageToSend] = useState(null);

  const messagesEndRef = useRef(null);

  const imageRef = useRef();

  const socket = useContext(SocketContext);

  const user = useSelector(selectCurrentUser);

  const [
    sendMessageToApi,
    { data: dataSendMessage, isSuccess: isSuccessSendMessage, isError },
  ] = useSendMessageToApiMutation();

  const [userReadMessage, {}] = useUserReadMessageMutation();

  const { data, isSuccess, isLoading } = useGetMessagesWithSpecificUserQuery(
    selectedChatter?._id,
    { skip: !selectedChatter }
  );

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  // useEffect(() => {
  //   if (isSuccessMessageRead) {
  //     updateMessageReadLeftSidePanel(dataMessageRead);
  //   }
  // }, [isSuccessMessageRead, dataMessageRead]);

  useEffect(() => {
    if (isSuccess) {
      console.log("1");
      console.log(data);
      setMessages(data.messages);

      const lastMsg = data.messages[data.messages.length - 1];

      if (
        !lastMsg?.read.marked &&
        data.messages.length > 0 &&
        lastMsg.fromUser !== user.id
      ) {
        userReadMessage({
          messageId: lastMsg._id,
        });
      }
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (!selectedChatter && !selectedGroup) {
      setMessages([]);
    }
  }, [selectedChatter, selectedGroup]);

  const {
    data: groupMessagesData,
    isSuccess: isSuccessGroupMessages,
    isLoading: isLoadingGroupMessages,
  } = useGetMessagesForGroupQuery(recipientGroupName, {
    skip: !selectedGroup,
  });

  useEffect(() => {
    if (isSuccessGroupMessages && groupMessagesData) {
      console.log("2");
      setMessages(groupMessagesData.messages);
    }
  }, [isSuccessGroupMessages, groupMessagesData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messageToSend && socket) {
      socket.emit("send_message", messageToSend);
      console.log("emit");
    }
  }, [messageToSend, socket, user?.id]);

  useEffect(() => {
    const handleReceiveMessageData = (data) => {
      console.log(2);
      console.log(data);
      setReceivedMessage(data);
    };
    socket.on("receive_message", handleReceiveMessageData);

    return () => {
      socket.off("receive_message", handleReceiveMessageData);
    };
  }, [socket]);

  useEffect(() => {
    if (isSuccessSendMessage) {
      console.log("3");
      setMessages(messages.concat(dataSendMessage));
      // updateMessageLeftPanel(dataSendMessage, false);
      refetch();
      closeNewMessageAfterMsg(false);
    }
    //eslint-disable-next-line
  }, [isSuccessSendMessage]);

  useEffect(() => {
    if (receivedMessage) {
      if (receivedMessage.fromUser === selectedChatter?._id) {
        console.log("4");
        setMessages(messages.concat(receivedMessage));
        userReadMessage({
          fromUser: receivedMessage.fromUser,
          recipient: receivedMessage.recipient,
        });
        // updateMessageLeftPanel(receivedMessage, true);
      } else if (receivedMessage.recipientName === recipientGroupName) {
        console.log("5");
        setMessages(messages.concat(receivedMessage));
        // userReadMessage({
        //   messageId: lastMsg._id,
        // });
        // updateMessageLeftPanel(receivedMessage, true);
      } else {
        // updateMessageLeftPanel(receivedMessage, false);
      }
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage]);

  const handleNewMessageChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const sendMessage = (e) => {
    if (newMessage.length > 0) {
      let messageToSend;
      if (socket) {
        messageToSend = {
          fromUser: user.id,
          recipient: selectedChatter?._id,
          senderName: user.fullName,
          recipientName: selectedChatter?.fullName,
          message: newMessage,
          createdAt: new Date().toISOString(),
        };
        if (selectedGroup) {
          messageToSend = {
            fromUser: user.id,
            fromUserName: user.fullName,
            me: user.id,
            recipientName: recipientGroupName,
            recipientGroup: selectedGroup.users || [
              ...selectedGroup.map((g) => g._id),
              user.id,
            ],
            message: newMessage,
            createdAt: new Date().toISOString(),
          };
        }
        console.log(1);
        sendMessageToApi(messageToSend);
        setMessageToSend(messageToSend);
        setNewMessage("");
        // newMessageRef.current = "";
      }
    }
  };

  let userMessages;

  if (messages.length > 0) {
    userMessages = messages?.map((message, i) => {
      return (
        <div
          key={i}
          className={
            message.fromUser === user?.id
              ? `${styles.message} ${styles.you}`
              : `${styles.message} ${styles.other}`
          }
          ref={messagesEndRef}
        >
          <span>{message?.message}</span>
          <span>{format(message?.createdAt)}</span>
        </div>
      );
    });
  }

  return (
    <>
      <div className={styles.conversationBoard}>{userMessages}</div>
      <input
        type="file"
        name=""
        id=""
        style={{ display: "none" }}
        ref={imageRef}
      />
      <div
        onClick={() => imageRef.current.click()}
        className={styles.fileInput}
      >
        +
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: ".3rem",
          padding: ".5rem 1rem 1rem 1rem",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <InputEmoji
          value={newMessage}
          onChange={handleNewMessageChange}
          onEnter={sendMessage}
          cleanOnEnter
          placeholder="Type a message"
          height={1}
        />
        {/* <input type="text" ref={newMessageRef}></input> */}
        <button className={styles.sendMessage} onClick={sendMessage}>
          <RiSendPlane2Fill style={{ fontSize: "20px" }} />
        </button>
      </div>
      {isLoading && <LoadingSpinner />}
      {isLoadingGroupMessages && <LoadingSpinner />}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with sending message"}
        />
      )}
    </>
  );
}

export default Messages;
