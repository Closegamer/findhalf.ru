const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const sendMail = require("../../utils/sendMail");

// @route    POST api/public/send-message
// @desc     Sendinf message to admin from contact form
// @access   Public
router.post("/send-message", async (req, res) => {
  try {
    const user = req.body.user;
    const header = req.body.header;
    const message = req.body.message;

    sendMail(
      "SalesReactor <no-reply@salesreactor.ru>",
      "closegamer@mail.ru",
      "Сообщение с контактной формы сайта SalesReactor",
      `Сообщение с контактной формы от пользователя <b>${user}</b>.<br /><br />Тема: ${header}<br /><br />Сообщение: ${message}`
    );

    res.json({
      success: true
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
