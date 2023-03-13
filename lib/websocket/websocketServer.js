const { Server } = require("socket.io");
const eventEmitter = require("../eventEmitter").eventEmitter;
const events = require("../eventEmitter").Events;

const server = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected with id ", socket.id);
    socket.on("new_message", (data) => {
      socket.emit("new_message_send", data);
    });
    eventEmitter.on(events.HELLO_WORLD, (data) => {
      socket.emit("Hello_world", { data });
    });

    socket.on("disconnect", () => {
      console.log("usuario desconectado ", socket.id);
    });
  });
};

module.exports = server;
