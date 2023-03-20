require("dotenv").config();
const connectionPromise = require("./connectAMQP");
const sendEmail = require("./sendEmail");
const welcomeEmail = require("./emails/Welcome");
const recoverPasswordEmail = require("./emails/recoverPassword");
const favoritesPriceDropEmail = require("./emails/favoritesPriceDrop");
const favoritesOutOfStockEmail = require("./emails/favoritesOutOfStock");
const favoritesBackInStockEmail = require("./emails/favoritesBackInStock");
const favoritesTurnNoActiveEmail = require("./emails/favoritesTurnNoActive");
const favoritesTurnActiveEmail = require("./emails/favoritesTurnActive");

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
        if (payload.email === "favoritesPriceDrop") {
          const user = payload.user;
          const advert = payload.advert;
          sendEmail(
            user.mail,
            "One of your favorites has dropped in price",
            favoritesPriceDropEmail(user.username, advert, payload.newPrice)
          );
        }

        if (payload.email === "favoritesOutOfStock") {
          const user = payload.user;
          const advert = payload.advert;
          sendEmail(
            user.mail,
            "One of your favorites has run out of stock",
            favoritesOutOfStockEmail(user.username, advert)
          );
        }

        if (payload.email === "favoritesBackInStock") {
          const user = payload.user;
          const advert = payload.advert;
          sendEmail(
            user.mail,
            "One of your favorites is back in stock",
            favoritesBackInStockEmail(user.username, advert)
          );
        }

        if (payload.email === "favoritesTurnNoActive") {
          const user = payload.user;
          const advert = payload.advert;
          sendEmail(
            user.mail,
            "One of your favorites has become inactive",
            favoritesTurnNoActiveEmail(user.username, advert)
          );
        }

        if (payload.email === "favoritesTurnActive") {
          const user = payload.user;
          const advert = payload.advert;
          sendEmail(
            user.mail,
            "One of your favorites is active again",
            favoritesTurnActiveEmail(user.username, advert)
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
