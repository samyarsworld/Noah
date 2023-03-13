const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getFriends,
  uploadMessageToDB,
} = require("../controller/chatController");

router.get("/get-friends", authMiddleware, getFriends);
router.post("/send-message", authMiddleware, uploadMessageToDB);

module.exports = router;
