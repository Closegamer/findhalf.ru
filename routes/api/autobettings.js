const express = require("express");
const router = express.Router();
const config = require("config");
const AutoBetting = require("../../models/AutoBetting");
const Games = require("../../models/Games");
const configClient = require("../../client/src/config.json");

// Routes
router.post("/", async (req, res) => {
  const user = req.body.userId;
  console.log("autobettings api");
  try {
    let userAutobettingGames = await AutoBetting.find({ user });
    console.log("userAutobettingGames found: ", userAutobettingGames);
    res.json({ success: true, games: userAutobettingGames });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/get-timers", async (req, res) => {
  try {
    let status = req.body.status;
    let allGames = await Games.find({ status });
    let timers = [];
    let timerUpdated = null;

    for (var i = 0; i < allGames.length; i++) {
      if (allGames[i].lastClick) {
        timerUpdated = (Date.now() - allGames[i].lastClick) / 1000;
        timers.push({ game: allGames[i]._id, timer: timerUpdated });
      }
    }
    res.json({ success: true, timers: timers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/refresh-game", async (req, res) => {
  try {
    console.log("route refresh");
    const games = req.body.games;
    const gameList = await Games.find({ status: "opened" });
    let gamesToChange = [];

    gameList.forEach(element => {
      for (var i = 0; i < games.length; i++) {
        if (element.humanId === games[i].humanId) {
          gamesToChange.push(element);
        }
      }
    });
    res.json({ success: true, games: gamesToChange });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
