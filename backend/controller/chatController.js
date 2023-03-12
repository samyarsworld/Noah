const User = require("../models/authModel");

module.exports.getFriends = async (req, res) => {
  const currentUserId = req.currentUserId;
  try {
    const allFriends = await User.find({});
    console.log(allFriends);
    const filterFriends = allFriends.filter(
      (friend) => friend.id !== currentUserId
    );
    res.status(200).json({ success: true, friends: filterFriends });
  } catch (error) {
    res.status(500).json({
      error: {
        errorMessage: "Internal Sever Error",
      },
    });
  }
};
