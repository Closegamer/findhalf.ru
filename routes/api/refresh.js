const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { createTokenPair } = require('../../utils/TokenHelpers');

const User = require('../../models/User');
const Token = require('../../models/Token');

// @route    GET api/refresh
// @desc     Refresh & get token
// @access   Public
router.get('/', async (req, res) => {
  const refreshToken = req.header('x-auth-refresh-token');
  // Check if not token
  if (!refreshToken) {
    return res.status(401).json({ msg: 'No token, refresh denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(refreshToken, config.get('jwtRefreshSecret'));

    const { uuid, user } = decoded;

    const storedToken = await Token.findOne({ uuid, user: user.id });

    if (!storedToken)
      return res.status(401).json({ msg: 'No token, refresh denied!' });

    const payload = {
      user: {
        id: user.id
      }
    };

    await Token.deleteOne({ _id: storedToken.id });

    const newTokens = await createTokenPair(payload, payload);

    res.json({ success: true, tokens: newTokens });
  } catch (err) {
    // Удалить протухший refresh-token
    if (err.name === 'TokenExpiredError') {
      const decoded = jwt.decode(refreshToken, config.get('jwtRefreshSecret'));
      const { uuid, user } = decoded;
      const storedToken = await Token.findOne({ uuid, user: user.id });
      if (storedToken) {
        await Token.deleteOne({ _id: storedToken.id });
      }
    }
    res.status(401).json({ msg: err.message });
  }
});

module.exports = router;
