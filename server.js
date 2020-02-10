const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const fileUpload = require("express-fileupload");
const crashRecovery = require("./routes/api/crashRecovery");
const autoexec = require("./routes/api/autoexec");

const fs = require("fs");

// const sslOptions = {
//   key: fs.readFileSync("ssl/salesreactor.ru_le2.key"),
//   cert: fs.readFileSync("ssl/salesreactor.ru_le2.crt")
// };

const ioServer = require("socket.io");

const socketPort = 4001;
const socketSSLPort = 4002;

const app = express();

const http = require("http");
// const https = require("https");

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(sslOptions);

const io = new ioServer();

io.attach(httpServer);
// io.attach(httpsServer);

// Init Middleware
app.use(
  fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "./tmp/"
  })
);

app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/refresh", require("./routes/api/refresh"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/playground", require("./routes/api/playground"));
app.use("/api/autobettings", require("./routes/api/autobettings"));
app.use("/api/public", require("./routes/api/public"));

// Serve static assets in production
console.log(__dirname);
app.use("/api/upload", express.static(__dirname + "/upload"));
app.use("/upload", express.static(__dirname + "/upload"));

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

io.on("connection", socket => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  // socket.on("alert", msg => {
  //   console.log("Alert is given with message: ", msg);
  //   io.sockets.emit("alert", msg);
  // });
  // socket.on("gameAppear", game => {
  //   console.log("New game appeared");
  //   io.sockets.emit("gameAppear", game);
  // });
  // socket.on("gameDemolition", humanId => {
  //   console.log("server: A game deleted");
  //   io.sockets.emit("gameDemolition", humanId);
  // });
  // socket.on("gameStatusChange", shuttle => {
  //   console.log("server: A status changed");
  //   io.sockets.emit("gameStatusChange", shuttle);
  // });
  // socket.on("gameCardUpdate", game => {
  //   console.log("server: A game card updated");
  //   io.sockets.emit("gameCardUpdate", game);
  // });
  // socket.on("adminGameOverNotice", game => {
  //   console.log("server: The game is over (to admin)");
  //   io.sockets.emit("adminGameOverNotice", game);
  // });
  // socket.on("timerSync", game => {
  //   console.log("server: timer for " + game.humanId + " was synced");
  //   io.sockets.emit("timerSync", game);
  // });
  // socket.on("playgroundRefresh", games => {
  //   // console.log("server: " + games.length + " games to be refreshed");
  //   io.sockets.emit("playgroundRefresh", games);
  // });
});

httpServer.listen(socketPort, () =>
  console.log(`Sockets for HTTP started on port ${socketPort}`)
);

// httpsServer.listen(socketSSLPort, () =>
//   console.log(`Sockets for HTTPS started on port ${socketSSLPort}`)
// );

module.exports = app;
