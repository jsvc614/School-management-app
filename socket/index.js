const io = require("socket.io")(8900, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://schoolapp-socketio.onrender.com"]
        : ["http://localhost:3000"],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    console.log(newUserId);
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  socket.on("send_message", (data) => {
    if (data.recipientGroup) {
      activeUsers.forEach((activeUser) => {
        if (
          data.recipientGroup.includes(activeUser.userId) &&
          data.fromUser !== activeUser.userId
        ) {
          io.to(activeUser.socketId).emit("receive_message", data);
        }
      });
    } else {
      const user = activeUsers.find((user) => user.userId === data.recipient);
      console.log("Sending from socket to :", data.recipient);
      console.log("Data: ", data);
      if (user) {
        io.to(user.socketId).emit("receive_message", data);
      }
    }
  });

  socket.on("send_notification", (data) => {
    console.log(data);
    // const user = activeUsers.find((user) => user.userId === data.userId);
    const users = activeUsers.filter((user) =>
      data?.users?.includes(user.userId)
    );
    console.log(users);
    console.log("Sending notification to :", users);
    console.log("Data: ", data);
    if (users) {
      users.forEach((user) =>
        io.to(user.socketId).emit("receive_notification", data)
      );
    }
  });
});
