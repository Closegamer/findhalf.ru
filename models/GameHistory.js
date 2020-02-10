const mongoose = require('mongoose');

const GameHistorySchema = new mongoose.Schema(
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
      type: Date,
      default: null
    },
    winner: {
      type: String,
      required: false
    },
    reactor: {
      type: String,
      required: false
    }
  },
  { versionKey: false }
);

module.exports = GameHistory = mongoose.model(
  'gamehistories',
  GameHistorySchema
);
