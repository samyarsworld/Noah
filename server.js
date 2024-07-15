const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const socketServer = require("./socket");
const http = require("http");

const databaseConnect = require("./config/database");
const authRouter = require("./routes/authRoute");
const chatRouter = require("./routes/chatRoute");

const app = express();
const bodyParser = require("body-parser");

require('dotenv').config();

const port = process.env.PORT || 5000;

// Alow cross origin request sharing
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://galactchat.netlify.app"
    ],
    credentials: true,
  })
);

// Configure Express to trust the first proxy in front of the app (CDN provider)
app.set("trust proxy", 1);

// Define middlewares
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser()); // make cookies available via req.cookies

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/api/chat", authRouter);
app.use("/api/chat", chatRouter);

const server = http.createServer(app);

databaseConnect();
socketServer(server);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
