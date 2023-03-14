const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getFriends,
  uploadMessageToDB,
  getMessageFromDB,
  sendImageMessage,
} = require("../controller/chatController");

router.get("/get-friends", authMiddleware, getFriends);
router.post("/send-message", authMiddleware, uploadMessageToDB);
router.post("/send-image-message", authMiddleware, sendImageMessage);
router.get("/get-message/:id", authMiddleware, getMessageFromDB);

module.exports = router;
