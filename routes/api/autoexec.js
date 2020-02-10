const connectDB = require("../../config/db");
const Games = require("../../models/Games");
const User = require("../../models/User");
const AutoBetting = require("../../models/AutoBetting");
const socketIOClient = require("socket.io-client");
const os = require("os");
const socket = socketIOClient("http://localhost:4001");
const processPid = process.pid;
const request = require("request");
const threadCount = os.cpus().length;
const mongoose = require("mongoose");
mongoose.Promise = Promise;

const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require("worker_threads");

// Connect Database
const dbConnect = async () => {
  await connectDB();
};

dbConnect();

let hashes = [];

setInterval(
  hashes => {
    var hashesLength = hashes.length;
    hashes.splice(0, hashesLength);
  },
  12000,
  hashes
);

const autoexec = async hashes => {
  let toProcessing = [];
  // выемка из базы
  const allAutobettings = await AutoBetting.find();
  const allGames = await Games.find();
  // console.log("toProcessing", toProcessing);
  if (isMainThread) {
    // This code is executed in the main thread and not in the worker.
    console.log("MAIN THREAD");

    const allAutobettingsCnt = allAutobettings.length;
    const allGamesCnt = allGames.length;

    for (var ag = 0; ag < allGamesCnt; ag++) {
      for (var g = 0; g < allAutobettingsCnt; g++) {
        if (allAutobettings[g]["game"] == allGames[ag]["_id"]) {
          if (allGames[ag]["status"] == "opened") {
            const currentDate = Date.now();
            if (
              allAutobettings[g]["clickTime"] * 1000 +
                allGames[ag]["lastClick"] <
              currentDate
            ) {
              const userId = allAutobettings[g]["user"];
              const currentUser = await User.findById(userId);

              if (allGames[ag]["winnerId"] != currentUser["humanId"]) {
                const balance = currentUser["balance"];
                const newValue = balance - allGames[ag]["betSize"];
                if (newValue > 0) {
                  if (
                    currentUser["email"] == "chmod@salesreactor.ru" ||
                    currentUser["email"] == "peresmeshnick@salesreactor.ru"
                  ) {
                    let hash = currentUser["email"] + allGames[ag]["humanId"];
                    let indexOfHash = hashes.indexOf(hash);

                    if (indexOfHash == -1) {
                      let leftHandReactorStuff = [
                        "Dyatlov",
                        "Andrew87",
                        "MaminSibiryak",
                        "Helen99",
                        "ElenaGolubeva",
                        "semen_protas",
                        "Ark",
                        "Sveta",
                        "Princess2019",
                        "Zara1",
                        "Sanek_Arm",
                        "iPhonka_kiss",
                        "ManInBlack",
                        "Zudin_Yura",
                        "Shmelev_Dima",
                        "fil99",
                        "Player_Good",
                        "Black",
                        "9_жизней",
                        "Мадонна",
                        "Бушик",
                        "Кошка_мышка",
                        "Наташа",
                        "Леня",
                        "Аркадий2000",
                        "Большой_Брат",
                        "Захаров",
                        "Паша",
                        "Паша19",
                        "РомКола",
                        "Санек",
                        "Петр_Калачев",
                        "Доктор",
                        "Дима",
                        "Оренбург2020",
                        "Погодина_Валя",
                        "БоковановКирилл",
                        "Крошка_ру",
                        "Андерсен",
                        "Карлсончик",
                        "___Маша___",
                        "Юля_П",
                        "Капитан_земли",
                        "Исмат",
                        "Вера9999",
                        "Сега"
                      ];

                      let rightHandReactorStuff = [
                        "77Москвич",
                        "Арбузик",
                        "Шпана19",
                        "ДядяФедор",
                        "Шопен",
                        "Костян",
                        "Земфира1994",
                        "Атос",
                        "Принц",
                        "Пупырка",
                        "Стасик",
                        "Россиянин",
                        "Шоколадка",
                        "Стас_1976",
                        "Витя",
                        "Вика",
                        "Нат78",
                        "Бумер",
                        "Школьница",
                        "Спанчбоб",
                        "Макарова_А",
                        "Мурманск",
                        "samoylova_vikk",
                        "Alina89",
                        "Karine",
                        "Intruder",
                        "Denis",
                        "Artemka",
                        "Artem",
                        "prezident",
                        "Sasha___",
                        "KingsOfLeon",
                        "Mara7",
                        "jamesbond",
                        "skyuoker",
                        "pitonka",
                        "IraHovrino",
                        "Zubanova",
                        "oldBoy",
                        "Kolya",
                        "Big_bang",
                        "PoetMichael",
                        "Misha",
                        "manman"
                      ];

                      let currentUserNick = currentUser["nick"];

                      if (currentUser["email"] == "chmod@salesreactor.ru") {
                        let nickValue = Math.floor(
                          Math.random() * leftHandReactorStuff.length
                        );
                        currentUserNick = leftHandReactorStuff[nickValue];
                      }

                      if (
                        currentUser["email"] == "peresmeshnick@salesreactor.ru"
                      ) {
                        let nickValue = Math.floor(
                          Math.random() * rightHandReactorStuff.length
                        );
                        currentUserNick = rightHandReactorStuff[nickValue];
                      }
                      currentUser["nick"] = currentUserNick;
                      let shuttle = [];
                      shuttle = [allGames[ag], currentUser];
                      toProcessing.push(shuttle);
                      hashes.push(hash);
                    }
                  } else {
                    let shuttle = [];
                    shuttle = [allGames[ag], currentUser];

                    toProcessing.push(shuttle);
                    continue;
                  }
                } else {
                  console.log("not enough money for autobetting");
                  continue;
                }
              } else {
                console.log("same user - hold turn");
                continue;
              }
            } else {
              console.log("its not the time yet");
              continue;
            }
          } else {
            console.log("wrong game status");
            continue;
          }
        }
      }
    }

    // Create the worker.

    var bigShuttle = [];
    var start = 0;
    var range = toProcessing.length / threadCount;

    // распределние по ядрам
    for (var i = 0; i < threadCount; i++) {
      console.log("allAutobettingsCnt: ", allAutobettingsCnt);
      console.log("toProcessing.length: ", toProcessing.length);
      bigShuttle = [];
      testShuttle = [];
      for (var q = start; q < start + range; q++) {
        if (toProcessing[q] && bigShuttle.length < range) {
          testShuttle.push(q);
          bigShuttle.push({
            user: toProcessing[q][1],
            game: toProcessing[q][0]
          });
        }
      }

      if (bigShuttle.length > 0) {
        console.log("testShuttle before worker: ", testShuttle);
        const worker = new Worker(__filename, {
          workerData: { number: i, load: bigShuttle }
        });

        bigShuttle = [];

        // Listen for messages from the worker and print them.
        worker.on("exit", () => {
          console.log("process exited");
        });

        worker.on("message", msg => {
          console.log("result: ", msg.result);
          let gtr = msg.gamesToRefresh;
          if (gtr.length > 0) {
            socket.emit("playgroundRefresh", gtr);
          }
        });
      }
      start = start + range;
    }
  } else {
    // console.log("WORKER THREAD");
    console.log("WORKER THREAD number: ", workerData.number);
    let gamesToRefresh = [];
    let landedShuttle = [].slice.call(workerData.load);
    if (landedShuttle.length > 0) {
      for (var w = 0; w < landedShuttle.length; w++) {
        const userPre = landedShuttle[w]["user"];
        const currentUser = userPre["_doc"];
        const gamePre = landedShuttle[w]["game"];
        let singleGame = gamePre["_doc"];

        const currentDate = Date.now();

        let totalIncomeParam = singleGame.totalIncome + singleGame.betSize;

        if (currentUser["stuff"] == "yes") {
          totalIncomeParam = singleGame.totalIncome;
        }

        // contribute
        await Games.findOneAndUpdate(
          { humanId: singleGame.humanId },
          {
            $set: {
              totalIncome: totalIncomeParam,
              currentPrice: singleGame.currentPrice + singleGame.singleStep,
              winner: currentUser["nick"],
              winnerId: currentUser["humanId"],
              lastClick: currentDate
            }
          },
          { new: false }
        );

        const userContribution = singleGame.betSize;
        const userDiscount = (userContribution - singleGame.singleStep) / 4;
        const userOverallContribution = currentUser.contribution;
        const userOverallDiscount = currentUser.discount;
        const userOverallBalance = currentUser.balance;

        await User.findOneAndUpdate(
          { email: currentUser["email"] },
          {
            $set: {
              contribution: userOverallContribution + userContribution,
              discount: userOverallDiscount + userDiscount,
              balance: userOverallBalance - userContribution
            }
          },
          { new: false }
        );

        gamesToRefresh.push(singleGame);
      }
    }
    parentPort.postMessage({
      gamesToRefresh,
      result: "done"
    });
    landedShuttle = [];
    gamesToRefresh = [];
    process.exit();
  }
};

// setTimeout(
//   hashes => {
//     setInterval(
//       hashes => {
//         autoexec(hashes);
//       },
//       3000,
//       hashes
//     );
//   },
//   5000,
//   hashes
// );

module.exports = autoexec;
