const createHttpError = require("http-errors");
const { Server } = require("socket.io");
const {
  getConversation,
  deleteDuplicateConversation,
  saveNewMessage,
  deleteConversation,
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
    //console.log("user connected with id ", socket.id);
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
      //console.log('se ha solicitado la conversación: ', conversation);
      socket.emit("send_conversation", conversation);
    });

    //If conversation is corrupted, we deleted it
    socket.on("corrupt_conversation", async (conversationId) => {
      const conversationDeleted = await deleteConversation(conversationId);
      // console.log(
      //   'se ha borrado una conversación corrupta: ',
      //   conversationDeleted
      // );
    });

    // Front send to back a new message by a conversation. Back save the message and return this to front for show.
    socket.on("new_message", async (data) => {
      const conversation = await saveNewMessage(data);
      if (conversation) {
        io.sockets.in(conversation.users[0]).emit("new_message_send", data);
        io.sockets.in(conversation.users[1]).emit("new_message_send", data);
      } else {
        //console.log('Ha habido un error');
        throw createHttpError(500, "error handling a chat");
      }
    });

    // Comunications inside API

    eventEmitter.on(events.NEW_CONVERSATION, (conversation) => {
      io.sockets
        .in(conversation.users[0])
        .emit("new_conversation_created", conversation);
      io.sockets
        .in(conversation.users[1])
        .emit("new_conversation_created", conversation);
    });

    eventEmitter.on(events.PRICE_DROP, (data) => {
      const user = data.subscriptor._id
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
      const advert = data.oldAdvert;
      const newPrice = data.newPrice;
      io.emit("Subscription_price_drop", { user, advert, newPrice });
    });

    eventEmitter.on(events.OUT_OF_STOCK, (data) => {
      const user = data.subscriptor._id
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
      const advert = data.oldAdvert;
      io.emit("Subscription_out_of_stock", { user, advert });
    });

    eventEmitter.on(events.BACK_IN_STOCK, (data) => {
      const user = data.subscriptor._id
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
      const advert = data.oldAdvert;
      io.emit("Subscription_back_in_stock", { user, advert });
    });

    eventEmitter.on(events.TURN_NO_ACTIVE, (data) => {
      const user = data.subscriptor._id
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
      const advert = data.oldAdvert;
      io.emit("Subscription_turn_no_active", { user, advert });
    });

    eventEmitter.on(events.TURN_ACTIVE, (data) => {
      const user = data.subscriptor._id
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
      const advert = data.oldAdvert;
      io.emit("Subscription_turn_active", { user, advert });
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
