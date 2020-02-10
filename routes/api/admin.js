const express = require("express");
const router = express.Router();
const config = require("config");
const path = require("path");
const uuid = require("uuid/v4");
const socketIOClient = require("socket.io-client");
const server = require("../../server.js");

const Games = require("../../models/Games");
const GameHistory = require("../../models/GameHistory");
const User = require("../../models/User");
const AutoBetting = require("../../models/AutoBetting");

// @route    POST api/admin/games/status-change
// @desc     Changing game status
// @access   Public

router.post("/games/setAutobetting", async (req, res) => {
  console.log("api admin games setAutobetting ");
  const gameId = req.body.game;
  const userId = req.body.user;
  const hash = userId + gameId;
  const position = req.body.position;
  let currentDate = Date.now();
  console.log("autobetting date: ", currentDate);
  try {
    let newRecord = null;

    if (!gameId) {
      return res.status(400).json({
        success: false,
        error: "No game to update"
      });
    } else {
      const isRecord = await AutoBetting.findOne({
        hash
      });
      console.log("isRecord: ", isRecord);
      if (isRecord && position == false) {
        console.log("deleting game from autobettings");
        await AutoBetting.findOneAndDelete({
          _id: isRecord._id
        });
      }

      function getRandomArbitary(min, max) {
        return Math.random() * (max - min) + min;
      }

      let clickTime = Math.round(getRandomArbitary(1, 10));

      if (position) {
        console.log("making record");
        newRecord = new AutoBetting({
          user: userId,
          game: gameId,
          hash,
          clickTime
        });

        await newRecord.save();
      }

      await Games.updateOne(
        { _id: gameId },
        {
          $set: {
            lastClick: currentDate
          }
        }
      );
    }

    res.json({
      success: true,
      gameId,
      position
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/admin/games/status-change
// @desc     Changing game status
// @access   Public

router.post("/games/status-change", async (req, res) => {
  console.log("api admin games status-change ");
  const currentDate = Date.now();
  const humanId = req.body.game.humanId;
  const newStatus = req.body.newStatus;

  try {
    let game = null;

    if (!humanId) {
      return res.status(400).json({
        success: false,
        error: "No game to update"
      });
    } else {
      game = await Games.updateOne(
        { humanId: humanId },
        {
          $set: {
            status: newStatus,
            lastClick: currentDate
          }
        },
        { upsert: false }
      );
    }

    res.json({
      success: true,
      humanId,
      game,
      status: newStatus
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/admin/games/reactor-switch Poli
// @desc     Changing game reactor state
// @access   Public

router.post("/games/reactor-switch2", async (req, res) => {
  console.log("api admin games reactor-switch ");

  const game = req.body.game;
  // const humanId = req.body.humanId;
  const reactorSwitch = req.body.reactorSwitch;
  console.log("reactor position: ", reactorSwitch);
  console.log("reactor game: ", game);
  console.log("reactor position: ", reactorSwitch);
  // const status = req.body.status;

  try {
    let gameToReactor = null;

    if (!game) {
      return res.status(400).json({
        success: false,
        error: "No game to update"
      });
    } else {
      gameToReactor = await Games.findOneAndUpdate(
        { humanId: game.humanId },
        { reactor: reactorSwitch },
        { upsert: false },
        null
      );

      // реактор здесь

      const gameToReactorOn = game._id;
      const stuff = await Users.find({
        stuff: "yes"
      });

      if (reactorSwitch == "on" && stuff.length > 0) {
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let newRecord = null;

        stuff.forEach(async person => {
          const isRecord = await AutoBetting.findOne({
            user: person.id,
            game: gameToReactorOn
          });

          if (isRecord) {
            await AutoBetting.findOneAndDelete({
              user: person.id,
              game: gameToReactorOn
            });
          }

          let clickTime = getRandomInt(2, 13);
          newRecord = new AutoBetting({
            user: person.id,
            game: gameToReactorOn,
            hash: person.id + gameToReactorOn["_id"],
            clickTime
          });

          await newRecord.save();
        });
      }

      if (reactorSwitch == "off") {
        stuff.forEach(async person => {
          const isRecord = await AutoBetting.findOne({
            user: person.id,
            game: gameToReactorOn
          });

          if (isRecord) {
            await AutoBetting.findOneAndDelete({
              user: person.id,
              game: gameToReactorOn
            });
          }
        });
      }

      // конец реактора

      res.json({
        success: true,
        humanId: game.humanId,
        reactor: reactorSwitch
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/admin/games/reactor-switch mono
// @desc     Changing game reactor state
// @access   Public

router.post("/games/reactor-switch", async (req, res) => {
  // console.log("api admin games reactor-switch mono");
  const game = req.body.game;
  const humanId = game.humanId;
  const reactorSwitch = req.body.reactorSwitch;

  try {
    let gameToReactor = null;

    if (!game) {
      return res.status(400).json({
        success: false,
        error: "No game to update"
      });
    } else {
      gameToReactor = await Games.findOneAndUpdate(
        { humanId },
        {
          $set: {
            reactor: reactorSwitch
          }
        },
        { new: false }
      );

      // реактор здесь

      const gameToReactorOn = game._id;
      const reactorStuff = await User.find({
        stuff: "yes"
      });

      let stuffArray = [];

      reactorStuff.forEach(stuff => {
        stuffArray.push(stuff);
      });

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      let newRecord = null;

      if (reactorSwitch == "on") {
        for (var i = 0; i < 2; i++) {
          newRecord = null;

          let isRecord = await AutoBetting.findOne({
            user: stuffArray[i].id,
            game: gameToReactorOn
          });

          if (isRecord) {
            await AutoBetting.findOneAndDelete({
              user: stuffArray[i].id,
              game: gameToReactorOn
            });
          }

          let clickTime = 1;

          if (i == 0) {
            clickTime = getRandomInt(1, 14);
          } else if (i == 1) {
            clickTime = getRandomInt(15, 20);
          }

          newRecord = new AutoBetting({
            user: stuffArray[i].id,
            game: gameToReactorOn,
            hash: stuffArray[i].id + gameToReactorOn,
            clickTime
          });
          await newRecord.save();
        }
      }

      if (reactorSwitch == "off") {
        for (var q = 0; q < 2; q++) {
          await AutoBetting.findOneAndDelete({
            user: stuffArray[q].id,
            game: gameToReactorOn
          });
        }
      }
      // конец реактора

      res.json({
        success: true,
        humanId,
        reactor: reactorSwitch
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/admin/games/create
// @desc     Create new game
// @access   Public
router.post("/games/create", async (req, res) => {
  console.log("api admin games create");

  let updateFlag = false;

  if (!!req.body.humanId) {
    updateFlag = true;
  }

  let {
    humanId,
    marketPrice,
    currentPrice,
    totalIncome,
    status,
    duration,
    caption,
    description,
    autoBetting,
    betSize,
    singleStep,
    winner,
    winnerId,
    lastClick,
    timer,
    reactor
  } = req.body;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if (!humanId) {
    humanId = getRandomInt(10000, 90000);
  }

  if (!currentPrice) {
    currentPrice = 250;
  }

  if (!singleStep) {
    singleStep = 1;
  }

  if (!totalIncome) {
    totalIncome = 0;
  }

  if (!status) {
    status = "holded";
  }

  if (!winner) {
    winner = "-";
  }

  if (!winnerId) {
    winnerId = "000";
  }

  if (!lastClick) {
    lastClick = Date.now();
  }

  if (!reactor) {
    reactor = "off";
  }

  if (!timer) {
    timer = 0;
  }

  try {
    let game = null;
    let gamehistory = null;

    if (updateFlag) {
      game = await Games.findOneAndUpdate(
        { humanId: humanId },
        req.body,
        { upsert: false },
        null
      );

      gamehistory = await GameHistory.findOneAndUpdate(
        { humanId: humanId },
        req.body,
        { upsert: false },
        null
      );
    } else {
      game = await Games.findOne({ humanId: humanId });
      gamehistory = await GameHistory.findOne({ humanId: humanId });
    }

    if (updateFlag && !game) {
      return res.status(400).json({
        success: false,
        error: "No game to update"
      });
    }

    if (!updateFlag && game) {
      if (game) {
        return res.status(400).json({
          success: false,
          error: "Game with this HumanId already exists"
        });
      }
    }

    if (!updateFlag) {
      game = new Games({
        humanId,
        marketPrice,
        currentPrice,
        totalIncome,
        status,
        duration,
        caption,
        description,
        autoBetting,
        betSize,
        singleStep,
        winner,
        winnerId,
        timer,
        lastClick,
        reactor
      });

      gamehistory = new GameHistory({
        humanId,
        marketPrice,
        currentPrice,
        totalIncome,
        status,
        duration,
        caption,
        description,
        autoBetting,
        betSize,
        singleStep,
        winner,
        winnerId,
        reactor
      });
    }

    if (Object.keys(req.files).length !== 0) {
      let bigPic = req.files.bigPic;
      const realName = bigPic.name;
      const guidName = uuid();
      const ext = path.extname(realName);

      game.bigPic = {
        guid: guidName,
        ext
      };

      bigPic.mv(`./upload/${guidName}${ext}`, function(err) {
        if (err) throw new Error(err);
      });
    }

    await game.save();
    await gamehistory.save();

    res.json({ success: true, game: game });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/admin/games/create/:humanId
// @desc     Load game
// @access   Public
router.get("/games/create/:humanId", async (req, res) => {
  console.log("api admin games create :humanId GET");
  try {
    let humId = req.params.humanId;
    let game = await Games.findOne({ humanId: humId });

    if (!game) {
      return res.status(400).json({
        success: false,
        error: "No game found"
      });
    }

    res.json({ success: true, loadedGame: game });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/admin/games/list
// @desc     Game list
// @access   Public
router.get("/games/list", async (req, res) => {
  console.log("api admin games list");
  try {
    let games = await Games.find();
    if (games.length < 1) {
      return res.status(400).json({
        success: false,
        error: "No games in collection"
      });
    }

    res.json({ success: true, games: games });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/admin/games/gamover
// @desc     autobetting collection clear for ended game
// @access   Public
router.post("/games/gameover", async (req, res) => {
  const gameOvered = req.body.game;

  try {
    await Games.updateOne(
      { humanId: gameOvered.humanId },
      {
        $set: {
          status: "closed"
        }
      },
      { new: false }
    );

    await AutoBetting.deleteMany({
      game: gameOvered._id
    });

    res.json({ success: true, gameOvered });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/games/gameover-check", async (req, res) => {
  console.log("api admin gameover-check");
  let gameIsOver = false;
  const gameToCheck = req.body.game;
  const currentDate = Date.now();

  try {
    const gameInDb = await Games.findOne({
      humanId: gameToCheck.humanId
    });

    const checkParam = gameInDb.lastClick + gameInDb.duration * 1000;

    const socket = socketIOClient("http://localhost:4001");

    if (checkParam < currentDate) {
      gameIsOver = true;
      const shuttle = [gameToCheck, "closed"];
      socket.emit("gameStatusChange", shuttle);

      socket.emit("adminGameOverNotice", gameToCheck);
    } else {
      socket.emit("timerSync", gameToCheck);
    }

    res.json({ success: true, game: gameToCheck, gameIsOver });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/admin/users/list
// @desc     Users list
// @access   Public
router.get("/users/list", async (req, res) => {
  console.log("api admin users list");
  try {
    let users = await User.find();
    if (users.length < 1) {
      return res.status(400).json({
        success: false,
        error: "No users in collection"
      });
    }

    res.json({ success: true, users: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/admin/users/list
// @desc     Users list
// @access   Public
router.post("/users/update", async (req, res) => {
  const user = req.body.user;
  const phone = req.body.phone;
  const address = req.body.address;

  try {
    await User.updateOne(
      { nick: user },
      {
        phone,
        address
      }
    );

    res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route    POST api/admin/games/delete/:humanId
// @desc     Delete current game
// @access   Public
router.post("/games/delete/:humanId", async (req, res) => {
  console.log("api admin games delete");
  let humId = req.params.humanId;
  try {
    const gameInGames = await Games.findOne({ humanId: humId });

    await AutoBetting.deleteMany({
      game: gameInGames._id
    });

    await Games.deleteOne({
      humanId: humId
    });

    const gameInGameHistory = await GameHistory.findOneAndUpdate(
      { humanId: humId },
      { status: "inHistory" },
      { upsert: false },
      null
    );

    res.json({ success: true, deleted: humId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
