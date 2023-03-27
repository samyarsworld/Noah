const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  const { authToken } = req.cookies;
  const { senderName } = req.body;

  if (authToken) {
    const deCodeToken = await jwt.verify(authToken, process.env.SECRET);
    req.userId = deCodeToken.id;
    next();
  } else {
    res.status(400).json({
      error: {
        errorMessage: ["Please login first"],
      },
    });
  }
};
