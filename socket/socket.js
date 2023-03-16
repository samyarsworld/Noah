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

io.on("connection", (socket) => {
  console.log("User is connected");
  socket.on("addUser", (userId, userInfo) => {
    addUser(userId, socket.id, userInfo);
    io.emit("getUser", users);
  });
  socket.on("sendMessage", (data) => {
    const user = findReceiver(data.receiverId);

    if (user !== undefined) {
      socket.to(user.socketId).emit("getMessage", {
        senderId: data.senderId,
        senderName: data.senderName,
        receiverId: data.receiverId,
        createAt: data.time,
        message: {
          text: data.message.text,
          image: data.message.image,
        },
      });
    }
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

  socket.on("disconnect", () => {
    console.log("User is disconnected ");
    userRemove(socket.id);
    io.emit("getUser", users);
  });
});
