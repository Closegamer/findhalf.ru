const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const { createTokenPair } = require('../../utils/TokenHelpers');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');
const Token = require('../../models/Token');

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.json({
        success: false,
        error: 'User not found'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/logout', auth, async (req, res) => {
  const token = req.header('x-auth-token');
  const decoded = jwt.verify(token, config.get('jwtSecret'));
  const { uuid, user } = decoded;
  const storedToken = await Token.findOne({ uuid, user: user.id });

  if (storedToken) {
    await Token.deleteOne({ _id: storedToken.id });
  }

  res.json({
    success: true
  });
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Пожалуйста, введите корректый email').isEmail(),
    check('password', 'Введите пароль').exists()
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
        .json({ success: false, error: errors.array().join(', ') });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: 'email или пароль введены неверно' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, error: 'email или пароль введены неверно' });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      const tokensData = await createTokenPair(payload, payload);

      res.json({ success: true, tokens: tokensData });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
