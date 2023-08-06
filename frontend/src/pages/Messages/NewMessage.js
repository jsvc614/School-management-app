import React, { useEffect, useRef, useState } from "react";
import styles from "./Messages.module.css";
import CloseButton from "react-bootstrap/CloseButton";
import { debounce } from "lodash";
import { useGetUserMutation } from "../../features/user/userService";
import ErrorModal from "../../components/pop/ErrorModal";

const NewMessage = ({ closeNewMessage, select }) => {
  const searchValueRef = useRef(null);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [searchUsers, setSearchUsers] = useState(null);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [getUser, { data: users, isSuccess, isError }] = useGetUserMutation();

  useEffect(() => {
    if (isSuccess) {
      setSearchUsers(users);
    }
  }, [isSuccess, users]);

  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  let filteredSearchUsers;

  if (searchUsers?.length > 0) {
    filteredSearchUsers = searchUsers?.filter(
      (searchUser) =>
        !selectedUsers?.some(
          (selectedUser) => selectedUser.fullName === searchUser.fullName
        )
    );
  }

  const onChangeSearchUser = debounce((e) => {
    const name = e.target.value;

    if (name.length === 0) {
      setSearchUsers(null);
    }

    if (name.length > 0) {
      getUser(name);
    }
  }, 500);

  const onSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    if (selectedUsers?.length === 0) {
      // selectUser(user);
      select(user, null);
    } else {
      // selectGroup([...selectedUsers, user]);
      select(null, [...selectedUsers, user]);
    }
    setSearchUsers("");
    searchValueRef.current.value = "";
  };

  const removeSelectedUser = (id) => {
    const filteredSelectedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser._id !== id
    );

    if (filteredSelectedUsers?.length === 1) {
      console.log("1");
      select(filteredSelectedUsers[0], null);
    } else if (filteredSelectedUsers?.length === 0) {
      select(null, null);
    } else {
      select(null, filteredSelectedUsers);
    }

    setSelectedUsers(filteredSelectedUsers);
  };

  const onCloseNewMessage = () => {
    closeNewMessage(true);
  };

  const selectedUsersContent = selectedUsers?.map((selectedUser) => (
    <div key={selectedUser._id} className={styles.selectedUser}>
      <p>{selectedUser.fullName}</p>
      <CloseButton onClick={() => removeSelectedUser(selectedUser._id)} />
    </div>
  ));

  return (
    <div className={styles.newMessageBoard}>
      <div className={styles.newMsgPanel}>
        <div className={styles.firstRow}>
          <h2>New message</h2>
          <CloseButton onClick={onCloseNewMessage} />
        </div>

        <div className={styles.newMessageInput}>
          <label>To:</label>
          <input
            type="text"
            onChange={onChangeSearchUser}
            ref={searchValueRef}
          ></input>
        </div>
        {selectedUsers?.length > 0 && (
          <div className={styles.selectedUsers}>{selectedUsersContent}</div>
        )}
      </div>
      {searchUsers && filteredSearchUsers && (
        <div className={styles.searchedUsers}>
          <h2>Users</h2>
          {filteredSearchUsers.map((user) => (
            <div key={user._id} onClick={() => onSelectUser(user)}>
              {user.fullName}
            </div>
          ))}
        </div>
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          close={() => setShowErrorModal(false)}
          message={"Problem with finding user"}
        />
      )}
    </div>
  );
};

export default NewMessage;
