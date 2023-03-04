const connectionPromise = require("./connectAMQP");
require("dotenv").config();
const sendEmail = require("./sendEmail");
const welcomeEmail = require("./emails/Welcome");
const recoverPasswordEmail = require("./emails/recoverPassword");

const QUEUE_NAME = "emails";

consumer().catch((err) => console.log("Hubo un error:", err));

async function consumer() {
  // conectar al servidor AMQP
  const connection = await connectionPromise;

  // crear un canal
  const canal = await connection.createChannel();

  // asegurar que existe una cola
  await canal.assertQueue(QUEUE_NAME, {
    durable: true, // la cola resiste a reinicios del broker
  });

  canal.prefetch(1);

  canal.consume(QUEUE_NAME, async (message) => {
    try {
      const payload = JSON.parse(message.content.toString());
      console.log(payload);

      if (payload.function === "sendEmail") {
        if (payload.email === "welcomeEmail") {
          const user = payload.user;
          sendEmail(
            user.mail,
            "Welcome to Handwebber",
            welcomeEmail(user.username)
          );
        }
        if (payload.email === "recoverPasswordEmail") {
          const user = payload.user;
          sendEmail(
            user.mail,
            "Recover your Password",
            recoverPasswordEmail(user.username, payload.pass)
          );
        }
      }

      // confirmo que he procesado el mensaje
      canal.ack(message);
    } catch (err) {
      console.log("Error en el mensaje" + err);
      // diferenciar si es un error operacional
      canal.nack(message); // dead letter queue
    }
  });
}
