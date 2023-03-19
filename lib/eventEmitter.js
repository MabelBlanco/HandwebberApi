const { EventEmitter } = require("events");

const Events = {
  HELLO_WORLD: "Hola mundo",
  NEW_CONVERSATION: "New_Conversation_Created",
  PRICE_DROP: "Price_drop",
};

const eventEmitter = new EventEmitter();

module.exports = { Events, eventEmitter };
