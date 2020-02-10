const jwt = require('jsonwebtoken');
const config = require('config');
const uuid = require('uuid/v4');

const Token = require('../models/Token');

const createTokenPair = async (accessPayload, refreshPayload) => {
  const date = Date.now();
  const accessExpired = 172800; // 48 часов - время жизни accessToken
  const expiredDate = date + accessExpired * 1000; // дата смерти accessToken
  const code = uuid();
  const accessToken = await jwt.sign(
    { ...accessPayload, uuid: code },
    config.get('jwtSecret'),
    {
      expiresIn: accessExpired
    }
  );
  const refreshToken = await jwt.sign(
    { ...refreshPayload, uuid: code },
    config.get('jwtRefreshSecret'),
    {
      expiresIn: '30d'
    }
  );

  const RefreshToken = new Token({
    uuid: code,
    user: refreshPayload.user.id
  });

  await RefreshToken.save();

  return {
    accessToken,
    refreshToken,
    expiredDate
  };
};

module.exports = { createTokenPair };
