const connectionPromise = require("./connectAMQP");

const QUEUE_NAME = "emails";

// publisher().catch((err) => console.log("Hubo un error:", err));

async function publisher(messageConfig) {
  // conectar al servidor AMQP
  const connection = await connectionPromise;

  // crear un canal
  const canal = await connection.createChannel();

  // asegurar que existe una cola
  await canal.assertQueue(QUEUE_NAME, {
    durable: true, // la cola resiste a reinicios del broker
  });

  const message = messageConfig;

  // enviar mensaje al consumidor
  keepSending = canal.sendToQueue(
    QUEUE_NAME,
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true, // el mensaje sobrevive a reinicios del broker
    }
  );

  if (!keepSending) {
    console.log("Full Buffer, waiting drain event...");
    await new Promise((resolve) => canal.on("drain", resolve));
    canal.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true, // el mensaje sobrevive a reinicios del broker
    });
  }
}

module.exports = publisher;
