const nodemailer = require("nodemailer");
const sendinblueTransport = require("nodemailer-sendinblue-transport");

module.exports = async function () {
  const testAccount = await nodemailer.createTestAccount();

  const developmentConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
  // We send emails with SENDINBLUE platform
  const productionConfig = new sendinblueTransport({
    apiKey: process.env.SENDINBLUE_EMAIL_SERVICE_APIKEY,
  });

  const activeConfig =
    process.env.NODE_ENV === "development"
      ? developmentConfig
      : productionConfig;

  return nodemailer.createTransport(activeConfig);
};
