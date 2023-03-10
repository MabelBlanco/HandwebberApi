const { Server } = require("socket.io");

const server = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected with id ", socket.id);
    socket.on("test", (data) => {
      console.log(data);
    });
  });
};

module.exports = server;
