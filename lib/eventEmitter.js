const { EventEmitter } = require("events");

const Events = {
  HELLO_WORLD: "Hola mundo",
  NEW_CONVERSATION: "New_Conversation_Created",
  PRICE_DROP: "Price_drop",
  OUT_OF_STOCK: "Out_of_stock",
  BACK_IN_STOCK: "Back_in_stock",
  TURN_NO_ACTIVE: "Turn_no_active",
  TURN_ACTIVE: "Turn_active",
};

const eventEmitter = new EventEmitter();

module.exports = { Events, eventEmitter };
