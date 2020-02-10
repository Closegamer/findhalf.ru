const express = require("express");
const router = express.Router();
const config = require("config");

const Games = require("../../models/Games");

// @route    GET api/playground
// @desc     Game list for playground
// @access   Public
router.get("/", async (req, res) => {
  try {
    let games = await Games.find().select("-totalIncome");
    if (games.length < 1) {
      return res.status(400).json({
        success: false,
        error: "No games in collection"
      });
    }

    res.json({ success: true, playground: games });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/playground/contribute
// @desc     Contributing a game
// @access   Public

router.post("/contribute", async (req, res) => {
  console.log("api playground contribute ");
  const { singleGame, user } = req.body;
  const lastClick = Date.now();

  try {
    const chosenGame = await Games.findById(singleGame);
    const currentUser = await User.findById(user);

    if (chosenGame.status == "opened") {
      const balance = currentUser.balance;
      const newValue = balance - chosenGame.betSize;
      if (newValue > 0) {
        await Games.updateOne(
          { _id: singleGame },
          {
            totalIncome: chosenGame.totalIncome + chosenGame.betSize,
            currentPrice: chosenGame.currentPrice + chosenGame.singleStep,
            winner: user.nick,
            winnerId: user._id,
            lastClick: lastClick
          }
        );

        const updatedGame = await Games.findById(singleGame);

        const discount =
          currentUser.discount +
          (chosenGame.betSize - chosenGame.singleStep) / 3;

        await User.updateOne(
          { _id: user._id },
          {
            balance: newValue,
            discount
          }
        );

        const updatedBalance = await User.findById(user);

        res.json({
          success: true,
          updatedGame,
          balance: updatedBalance.balance
        });
      } else {
        res.status(401).json({ error: "No money" });
      }
    } else {
      res.json({ success: false, updatedGame });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
