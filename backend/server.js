const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketServer = require("./socket");

const databaseConnect = require("./config/database");
const authRouter = require("./routes/authRoute");
const chatRouter = require("./routes/chatRoute");

dotenv.config({
  path: "config/config.env",
});

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://galactchat.netlify.app"],
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/chat", authRouter);
app.use("/api/chat", chatRouter);

const server = http.createServer(app);

databaseConnect();
socketServer(server);

server.listen(port, () => {
  console.log(`Server running on http://localhost:5000/`);
});
