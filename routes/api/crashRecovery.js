const connectDB = require("../../config/db");
const Games = require("../../models/Games");
const mongoose = require("mongoose");
mongoose.Promise = Promise;

// Connect Database
const dbConnect = async () => {
  await connectDB();
};

dbConnect();

const currentDate = Date.now();

const crashRecovery = async currentDate => {
  const allGames = await Games.find();
  await Games.updateMany(
    { status: "opened" },
    {
      $set: {
        lastClick: currentDate
      }
    },
    { upsert: false }
  );
};

crashRecovery(currentDate);

module.exports = crashRecovery;
