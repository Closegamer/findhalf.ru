const nodemailer = require("nodemailer");
const config = require("../config/default.json");

const sendMail = (from, to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "mail",
    host: "mail.salesreactor.ru",
    port: 25,
    secure: false,
    requireTLS: false,
    auth: {
      user: config.mailUser,
      pass: config.mailPassword
    }
  });

  const mailOptions = {
    from,
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      return console.log(err);
    }
    return console.log("Message sent: " + info.response);
  });
};

module.exports = sendMail;
