const { Server } = require("socket.io");
const {
  getConversation,
  deleteDuplicateConversation,
  saveNewMessage,
} = require("./chatSocketFunctions");
const eventEmitter = require("../eventEmitter").eventEmitter;
const events = require("../eventEmitter").Events;

const server = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    // Show user connected id
    console.log("user connected with id ", socket.id);
    socket.on("join", (data) => {
      console.log("El usuario se ha identificado con el siguiente Id:", data);
      socket.join(data);
    });

    // Front ask conversation and back look for it and return this.
    // If the conversation not exist, we created one and return the new conversation.
    // If the ask conversation is too fast and we created 2, we deleted one of them and send the other.
    socket.on("ask_conversation", async (data) => {
      const conversation = await getConversation(data);
      await deleteDuplicateConversation(data);
      socket.emit("send_conversation", conversation);
    });

    // Front send to back a new message by a conversation. Back save the message and return this to front for show.
    socket.on("new_message", async (data) => {
      const conversation = await saveNewMessage(data);
      if (conversation) {
        io.sockets.in(conversation.users[0]).emit("new_message_send", data);
        io.sockets.in(conversation.users[1]).emit("new_message_send", data);
      } else {
        console.log("Ha habido un error");
      }
    });

    // Test comunication inside Back (for notifications)
    eventEmitter.on(events.HELLO_WORLD, (data) => {
      socket.emit("Hello_world", { data });
    });

    // Show user disconnected
    socket.on("disconnect", (reason) => {
      console.log(
        "usuario desconectado ",
        socket.id,
        "por el motivo: ",
        reason
      );
    });
  });
};

module.exports = server;
