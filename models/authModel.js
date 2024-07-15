const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = model("User", userSchema);
module.exports = UserModel;
