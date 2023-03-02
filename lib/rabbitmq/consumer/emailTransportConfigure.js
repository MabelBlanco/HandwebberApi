const nodemailer = require("nodemailer");

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

  const productionConfig = {
    service: process.env.EMAIL_SERVICE_NAME,
    auth: {
      user: process.env.EMAIL_SERVICE_USER,
      pass: process.env.EMAIL_SERVICE_PASS,
    },
  };

  const activeConfig =
    process.env.NODE_ENV === "development"
      ? developmentConfig
      : productionConfig;

  return nodemailer.createTransport(activeConfig);
};
