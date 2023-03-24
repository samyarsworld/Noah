const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const databaseConnect = require("./config/database");
const authRouter = require("./routes/authRoute");
const chatRouter = require("./routes/chatRoute");

dotenv.config({
  path: "backend/config/config.env",
});

const port = process.env.port || 5000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/chat", authRouter);
app.use("/api/chat", chatRouter);

databaseConnect();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:5000`);
});
