const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const connectedUsers = {};

io.on("connection", socket => {
  const { user } = socket.handshake.query;
  console.log("Nova Conexão", socket.id);

  connectedUsers[user] = socket.id;
});

mongoose.connect(
  "mongodb+srv://omnistack:54548787@cluster0-goeud.mongodb.net/Tindev?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

app.use((req, res, next) => {
  req.io = io;
  req.connectUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);
