const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];
const addUser = (userId, socketId, userInfo) => {
  const checkUser = users.some((user) => user.userId === userId);
  if (!checkUser) {
    users.push({ userId, socketId, userInfo });
  }
};

const findReceiver = (id) => {
  return users.find((user) => user.userId === id);
};

const userRemove = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const userLogout = (userId) => {
  users = users.filter((user) => user.userId !== userId);
};

io.on("connection", (socket) => {
  console.log("User is connected");
  socket.on("addUser", (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit("getUser", users);
  });

  socket.on("typingMessage", (data) => {
    const user = findReceiver(data.receiverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("getTypingMessage", {
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
      });
    }
  });

  socket.on("sendMessage", (data) => {
    const user = findReceiver(data.receiverId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("getMessage", data);
    }
  });

  socket.on("messageSeen", (message) => {
    const user = findReceiver(message.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("messageSeenResponse", message);
    }
  });

  socket.on("messageDelivered", (message) => {
    const user = findReceiver(message.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("messageDeliveredResponse", message);
    }
  });

  socket.on("seen", (data) => {
    const user = findReceiver(data.senderId);
    if (user !== undefined) {
      socket.to(user.socketId).emit("seenSuccess", data);
    }
  });

  socket.on("logout", (userId) => {
    userLogout(userId);
  });

  socket.on("disconnect", () => {
    console.log("User is disconnected ");
    userRemove(socket.id);
    io.emit("getUser", users);
  });
});
