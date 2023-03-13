const User = require("../models/authModel");
const Message = require("../models/chatModel");

module.exports.getFriends = async (req, res) => {
  const currentUserId = req.currentUserId;
  try {
    const allFriends = await User.find({});
    const filterFriends = allFriends.filter(
      (friend) => friend.id !== currentUserId
    );
    res.status(200).json({ success: true, friends: filterFriends });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server Error",
      },
    });
  }
};

module.exports.uploadMessageToDB = async (req, res) => {
  const { senderName, receiverId, message } = req.body;
  const senderId = req.currentUserId;

  try {
    const sentMessage = await Message.create({
      senderId: senderId,
      senderName: senderName,
      receiverId: receiverId,
      message: {
        text: message,
        image: "",
      },
    });
    res.status(201).json({
      success: true,
      message: sentMessage,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};
