const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  humanId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  nick: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  stuff: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  contribution: {
    type: Number,
    required: true
  },
  zodiacDaySign: {
    type: String,
    required: true
  },
  zodiacNightSign: {
    type: String,
    required: true
  },
  yearSign: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("user", UserSchema);
