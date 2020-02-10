const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users'
    },
    uuid: {
      type: String,
      required: true,
      unique: true
    }
  },
  { versionKey: false }
);

module.exports = Token = mongoose.model('token', TokenSchema);
