const mongoose = require("mongoose");

const AutoBettingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true
    },
    game: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: true
    },
    clickTime: {
      type: Number,
      required: true
    }
  },
  { versionKey: false }
);

module.exports = AutoBetting = mongoose.model("autobetting", AutoBettingSchema);
