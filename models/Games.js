const mongoose = require('mongoose');

const GamesSchema = new mongoose.Schema(
  {
    humanId: {
      type: String,
      required: false
    },
    marketPrice: {
      type: Number,
      required: false
    },
    currentPrice: {
      type: Number,
      required: false
    },
    totalIncome: {
      type: Number
    },
    status: {
      type: String,
      required: false
    },
    caption: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    duration: {
      type: Number,
      required: false
    },
    autoBetting: {
      type: String,
      required: false
    },
    betSize: {
      type: Number,
      required: false
    },
    singleStep: {
      type: Number,
      required: false
    },
    lastClick: {
      type: Number,
      required: false
    },
    timer: {
      type: Number,
      required: false
    },
    winner: {
      type: String,
      required: false
    },
    winnerId: {
      type: String,
      required: false
    },
    reactor: {
      type: String,
      required: false
    },
    bigPic: {
      guid: {
        type: String,
        unique: true,
        required: true
      },
      ext: {
        type: String,
        required: true
      }
    }
  },
  { versionKey: false }
);

module.exports = Games = mongoose.model('games', GamesSchema);
