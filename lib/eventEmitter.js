const { EventEmitter } = require("events");

const Events = {
  HELLO_WORLD: "Hola mundo",
};

const eventEmitter = new EventEmitter();

module.exports = { Events, eventEmitter };
