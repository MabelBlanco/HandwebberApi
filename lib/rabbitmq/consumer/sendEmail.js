const emailTransport = require("./emailTransportConfigure");
const nodemailer = require("nodemailer");

// Create a method for send email
const sendEmail = async function (mail, subject, body) {
  const transport = await emailTransport();

  const result = await transport.sendMail({
    from: process.env.EMAIL_SERVICE_FROM,
    to: mail,
    subject,
    html: body,
  });

  console.log(nodemailer.getTestMessageUrl(result));
  return result;
};

module.exports = sendEmail;
