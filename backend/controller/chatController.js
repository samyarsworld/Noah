const UserModel = require("../models/authModel");
const MessageModel = require("../models/chatModel");
const formidable = require("formidable");
const fs = require("fs");

module.exports.getFriends = async (req, res) => {
  const currentUserId = req.currentUserId;
  try {
    const allFriends = await UserModel.find({});
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
    const sentMessage = await MessageModel.create({
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
        errorMessage: "Internal Server Error",
      },
    });
  }
};

module.exports.getMessageFromDB = async (req, res) => {
  const currentUserId = req.currentUserId;
  const senderId = req.params.id;
  try {
    const allMessages = await await MessageModel.find().or([
      { senderId: currentUserId, receiverId: senderId },
      { senderId: senderId, receiverId: currentUserId },
    ]);
    // OR
    // let allMessage = await MessageModel.find({});
    // allMessage = allMessage.filter(
    //   (m) =>
    //     (m.senderId === currentUserId && m.receiverId === senderId) ||
    //     (m.receiverId === currentUserId && m.senderId === senderId)
    // );

    res.status(201).json({
      success: true,
      messages: allMessages,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Server Error",
      },
    });
  }
};

module.exports.sendImageMessage = (req, res) => {
  const form = formidable();
  const senderId = req.currentUserId;

  form.parse(req, (err, fields, files) => {
    const { senderName, receiverId, imageName } = fields;

    const newPath = __dirname + `/../../frontend/public/images/${imageName}`;
    files.image.originalFilename = imageName;

    try {
      fs.copyFile(files.image.filepath, newPath, async (err) => {
        if (err) {
          res.status(500).json({
            error: {
              errorMessage: "Image upload fail",
            },
          });
        } else {
          const sendMessage = await MessageModel.create({
            senderId: senderId,
            senderName: senderName,
            receiverId: receiverId,
            message: {
              text: "",
              image: files.image.originalFilename,
            },
          });
          res.status(201).json({
            success: true,
            message: sendMessage,
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        error: {
          errorMessage: "Internal Server Error",
        },
      });
    }
  });
};
