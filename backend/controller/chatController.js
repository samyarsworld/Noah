const UserModel = require("../models/authModel");
const MessageModel = require("../models/chatModel");
const formidable = require("formidable");
const fs = require("fs");

module.exports.getFriends = async (req, res) => {
  const userId = req.userId;
  let friendsInfo = [];
  try {
    const friends = await UserModel.find({ _id: { $ne: userId } });

    for (let i = 0; i < friends.length; i++) {
      let lastMessageInfo = await getLastMessage(userId, friends[i]._id);
      friendsInfo = [
        ...friendsInfo,
        {
          friendInfo: friends[i],
          lastMessageInfo: lastMessageInfo,
        },
      ];
    }

    res.status(200).json({ success: true, friends: friendsInfo });
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
  const senderId = req.userId;
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
  const userId = req.userId;
  const senderId = req.params.id;
  try {
    const allMessages = await await MessageModel.find().or([
      { senderId: userId, receiverId: senderId },
      { senderId: senderId, receiverId: userId },
    ]);

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
  const senderId = req.userId;

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

const getLastMessage = async (userId, friendId) => {
  const lastMessage = await MessageModel.findOne()
    .or([
      { senderId: userId, receiverId: friendId },
      { senderId: friendId, receiverId: userId },
    ])
    .sort({
      updatedAt: -1,
    });

  return lastMessage;
};

module.exports.messageSeen = async (req, res) => {
  const messageId = req.body._id;

  await MessageModel.findByIdAndUpdate(messageId, {
    status: "seen",
  })
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch(() => {
      res.status(500).json({
        error: {
          errorMessage: "Internal Server Error",
        },
      });
    });
};

module.exports.deliveredMessage = async (req, res) => {
  const messageId = req.body._id;

  await MessageModel.findByIdAndUpdate(messageId, {
    status: "delivered",
  })
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch(() => {
      res.status(500).json({
        error: {
          errorMessage: "Internal Server Error",
        },
      });
    });
};
