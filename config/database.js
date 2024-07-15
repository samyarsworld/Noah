const mongoose = require("mongoose");
require('dotenv').config();


const databaseConnect = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_ATLAS_URL)
    .then(() => console.log("Connected to mongo"))
    .catch((err) => {
      console.error("Failed to connect with mongo");
      console.error(err);
    });
};

module.exports = databaseConnect;
