const {
  userRegister,
  userLogin,
  userLogout,
  genImage,
} = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/user-register", userRegister);
router.post("/user-login", userLogin);
router.post("/user-logout", authMiddleware, userLogout);

router.post("/gen-image", genImage);

module.exports = router;
