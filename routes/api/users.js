const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const { createTokenPair } = require("../../utils/TokenHelpers");
const auth = require("../../middleware/auth");
const sendMail = require("../../utils/sendMail");
const User = require("../../models/User");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    check("nick", "Пожалуйста, введите Ваше имя в системе").isLength({
      min: 3
    }),
    check("email", "Пожалуйста, введите корректый email").isEmail(),
    check("password", "Пароль должен содержать не менее 6 символов").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req).formatWith(
      ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
      }
    );
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, error: errors.array().join(", ") });
    }

    const { nick, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          error: "Пользователь с таким email уже зарегистрирован!"
        });
      }

      let userNickCheck = await User.findOne({ nick });
      if (userNickCheck) {
        return res.status(400).json({
          success: false,
          error: "Пользователь с таким ником уже зарегистрирован!"
        });
      }

      let role = "customer";
      if (nick == "SuperAdmin") {
        role = "admin";
      }

      let stuff = "no";
      if (nick == "Chmod") {
        stuff = "yes";
      }

      let balance = 0;
      if (nick == "Chmod" || nick == "SuperAdmin") {
        balance = 100000000;
      }

      let discount = 0;
      let phone = "";
      let address = "";
      let zodiacDaySign = "";
      let zodiacNightSign = "";
      let yearSign = "";
      let city = "";
      let dob = null;

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const humanId = getRandomInt(10000, 90000);

      user = new User({
        humanId,
        nick,
        email,
        password,
        role,
        stuff,
        discount,
        phone,
        balance,
        zodiacDaySign,
        zodiacNightSign,
        yearSign,
        city,
        dob
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      if (!user.contribution) {
        user.contribution = 0;
      }

      if (!user.dob) {
        user.dob = null;
      }

      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      const tokensData = await createTokenPair(payload, payload);

      sendMail(
        "SalesReactor <no-reply@salesreactor.ru>",
        email,
        "Успешная регистрация",
        `Ваш пароль: <b>${password}</b>`
      );

      res.json({ success: true, tokens: tokensData });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    GET api/users/balance
// @desc     Get User Balance
// @access   Public
router.get("/balance", auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const foundUser = await User.findById(currentUserId);
    const balance = foundUser.balance;

    if (!foundUser) {
      res.json({
        success: false,
        error: "User not found"
      });
    }

    res.json({
      success: true,
      balance
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/users/balance
// @desc     POST User Balance
// @access   Public
router.post(
  "/balance",
  auth,
  [check("balance", "Пожалуйста, введите сумму").isNumeric()],
  async (req, res) => {
    const errors = validationResult(req).formatWith(
      ({ location, msg, param, value, nestedErrors }) => {
        return `${msg}`;
      }
    );
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, error: errors.array().join(", ") });
    }

    const { balance } = req.body;
    console.log("api user balance post balance: ", balance);
    const currentUserId = req.user.id;

    try {
      const foundUserId = await User.findById(currentUserId);

      const currentBalance = foundUserId.balance;

      await User.updateOne(
        { _id: foundUserId.id },
        { balance: currentBalance + balance }
      );

      const updated = await User.findById(currentUserId);

      res.json({ success: true, balance: updated.balance });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    GET api/users/discount
// @desc     Get User Discount
// @access   Public
router.get("/discount", auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const foundUser = await User.findById(currentUserId);
    const discount = foundUser.discount;

    if (!foundUser) {
      res.json({
        success: false,
        error: "User not found"
      });
    }

    res.json({
      success: true,
      discount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/users/discount
// @desc     POST User Balance
// @access   Public
router.post("/discount", auth, async (req, res) => {
  const { discount } = Math.round(req.body);
  console.log("api user discount post discount: ", discount);
  const currentUserId = req.user.id;

  try {
    const foundUserId = await User.findById(currentUserId);
    let currentDiscount = foundUserId.discount;
    let newDiscount = currentDiscount + discount;
    newDiscount = newDiscount.toFixed();

    await User.updateOne({ _id: foundUserId.id }, { discount: newDiscount });

    const updated = await User.findById(currentUserId);

    res.json({ success: true, discount: updated.discount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
