const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getFriends,
  uploadMessageToDB,
  getMessageFromDB,
  sendImageMessage,
  messageSeen,
  delivaredMessage,
} = require("../controller/chatController");

router.get("/get-friends", authMiddleware, getFriends);
router.post("/send-message", authMiddleware, uploadMessageToDB);
router.post("/send-image-message", authMiddleware, sendImageMessage);
router.get("/get-message/:id", authMiddleware, getMessageFromDB);
router.post("/seen-message", authMiddleware, messageSeen);
router.post("/delivered-message", authMiddleware, delivaredMessage);

module.exports = router;
