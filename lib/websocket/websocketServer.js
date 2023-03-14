const { Server } = require("socket.io");
const {
  getConversation,
  deleteDuplicateConversation,
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

    // Front ask conversation and back look for it and return this. If the conversation not exist, we created one and return the neww conversation.
    socket.on("ask_conversation", async (data) => {
      const conversation = await getConversation(data);
      await deleteDuplicateConversation(data);
      console.log(conversation);
    });

    // Front send to back a new message by a conversation. Back save the message and return this to front for show.
    socket.on("new_message", (data) => {
      socket.emit("new_message_send", data);
    });

    // Test comunication inside Back
    eventEmitter.on(events.HELLO_WORLD, (data) => {
      socket.emit("Hello_world", { data });
    });

    // Show user disconnected id
    socket.on("disconnect", () => {
      console.log("usuario desconectado ", socket.id);
    });
  });
};

module.exports = server;
