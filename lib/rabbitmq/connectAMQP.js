const amqplib = require("amqplib");

const connectionPromise = amqplib.connect(process.env.RABBITMQ_URL);

module.exports = connectionPromise;
