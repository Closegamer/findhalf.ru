import axios from "axios";
import Immutable from "seamless-immutable";
import { setBalanceSuccess } from "./balance";
import socketIOClient from "socket.io-client";
import config from "../config.json";

const prefix = "playground";

const LOADING_GAMES_START = `${prefix}/LOADING_GAMES_START`;
const LOADING_GAMES_SUCCEED = `${prefix}/LOADING_GAMES_SUCCEED`;
const LOADING_GAMES_FAILED = `${prefix}/LOADING_GAMES_FAILED`;

const GAME_CONTRIBUTE_START = `${prefix}/GAME_CONTRIBUTE_START`;
const GAME_CONTRIBUTE_SUCCEED = `${prefix}/GAME_CONTRIBUTE_SUCCEED`;
const GAME_CONTRIBUTE_FAILED = `${prefix}/GAME_CONTRIBUTE_FAILED`;

const GAME_DEMOLITION_EXECUTION = `${prefix}/GAME_DEMOLITION_EXECUTION`;

const GAME_APPEAR_EXECUTION = `${prefix}/GAME_APPEAR_EXECUTION`;

const GAME_STATUS_CHANGE_EXECUTION = `${prefix}/GAME_STATUS_CHANGE_EXECUTION`;

const GAME_CARD_UPDATE_EXECUTION = `${prefix}/GAME_CARD_UPDATE_EXECUTION`;

const GAME_TIMER_SYNC_EXECUTION = `${prefix}/GAME_TIMER_SYNC_EXECUTION`;

const CHECK_AUTOBETTING_SWITCH_EXECUTION_SUCCEED = `${prefix}/CHECK_AUTOBETTING_SWITCH_EXECUTION_SUCCEED`;

const CHECK_AUTOBETTING_SWITCH_EXECUTION_FAILED = `${prefix}/CHECK_AUTOBETTING_SWITCH_EXECUTION_FAILED`;

const GET_TIMERS_SUCCEED = `${prefix}/GET_TIMERS_SUCCEED`;

const GET_TIMERS_FAILED = `${prefix}/GET_TIMERS_FAILED`;

const PLAYGROUND_REFRESH = `${prefix}/PLAYGROUND_REFRESH`;

// Game contribute

const gameContributeStart = () => ({
  type: GAME_CONTRIBUTE_START
});

const gameContributeSucceed = game => ({
  type: GAME_CONTRIBUTE_SUCCEED,
  game
});

const gameContributeFailed = error => ({
  type: GAME_CONTRIBUTE_FAILED,
  error
});

const loadGamesStart = () => ({
  type: LOADING_GAMES_START
});

const loadGamesSucceed = playground => ({
  type: LOADING_GAMES_SUCCEED,
  playground,
  fetchedAt: Date.now()
});

const loadGamesFailed = error => ({
  type: LOADING_GAMES_FAILED,
  error
});

// Game demolition

const gameDemolitionExecution = humanId => ({
  type: GAME_DEMOLITION_EXECUTION,
  humanId
});

// Game appear

const gameAppearExecution = newGame => ({
  type: GAME_APPEAR_EXECUTION,
  newGame
});

// Game status change

const gameStatusChangeExecution = (game, newStatus) => ({
  type: GAME_STATUS_CHANGE_EXECUTION,
  game,
  newStatus
});

// Game card update

const gameCardUpdateExecution = game => ({
  type: GAME_CARD_UPDATE_EXECUTION,
  game
});

// Game timer sync

const timerSyncExecution = game => ({
  type: GAME_TIMER_SYNC_EXECUTION,
  game,
  lastContribute: Date.now()
});

// Check AutoBetting

const checkAutobettingSwitchExecutionSucceed = games => ({
  type: CHECK_AUTOBETTING_SWITCH_EXECUTION_SUCCEED,
  games
});

const checkAutobettingSwitchExecutionFailed = games => ({
  type: CHECK_AUTOBETTING_SWITCH_EXECUTION_FAILED,
  games
});

// Get timers

const getTimersExecutionSucceed = (game, timer) => ({
  type: GET_TIMERS_SUCCEED,
  game,
  timer
});

const getTimersExecutionFailed = () => ({
  type: GET_TIMERS_FAILED
});

// autobetting refresh
const playgroundRefreshExecute = games => ({
  type: PLAYGROUND_REFRESH,
  games
});

export const refresh = games => (dispatch, getState) => {
  console.log("playground refresh is here");

  // const autobettingList = getState().playground.autobettingList[0];
  if (games) {
    return axios
      .post("/api/autobettings/refresh-game/", {
        games
      })
      .then(response => {
        dispatch(playgroundRefreshExecute(response.data.games));

        return response.data;
      })
      .catch(error => {
        console.log("error: ", error);
      });
  }
};

export const getTimers = () => (dispatch, getState) => {
  console.log("=====================================> getTimers is here");
  return axios
    .post("/api/autobettings/get-timers", {
      status: "opened"
    })
    .then(response => {
      const timers = response.data.timers;
      timers.forEach(element => {
        const game = element.game;
        const timer = element.timer;
        dispatch(getTimersExecutionSucceed(game, timer));
      });
      for (var i = 0; i < timers.length; i++) {}

      return response.data;
    })
    .catch(error => {
      dispatch(getTimersExecutionFailed(error.message));
    });
};

export const checkAutobettingSwitch = () => (dispatch, getState) => {
  console.log("checkAutobettingSwitch is here");
  return axios
    .post("/api/autobettings/", {
      userId: getState().auth.user._id
    })
    .then(response => {
      dispatch(checkAutobettingSwitchExecutionSucceed(response.data.games));

      return response.data;
    })
    .catch(error => {
      dispatch(checkAutobettingSwitchExecutionFailed(error.message));
    });
};

export const timerSync = game => (dispatch, getState) => {
  console.log("================================== > timerSync is here ");
  return dispatch(timerSyncExecution(game));
};

export const gameCardUpdate = game => (dispatch, getState) => {
  console.log("gameCardUpdate is here");
  return dispatch(gameCardUpdateExecution(game));
};

export const gameStatusChange = (game, newStatus) => (dispatch, getState) => {
  console.log("gameStatusChange is here");
  return dispatch(gameStatusChangeExecution(game, newStatus));
};

export const gameAppear = newGame => (dispatch, getState) => {
  console.log("gameAppear is here");
  return dispatch(gameAppearExecution(newGame));
};

export const gameDemolition = humanId => (dispatch, getState) => {
  console.log("gameDemolition is here");
  dispatch(gameDemolitionExecution(humanId));
};

export const gameContribution = singleGame => (dispatch, getState) => {
  console.log("gameContribution is here");
  dispatch(gameContributeStart());
  return axios
    .post("/api/playground/contribute", {
      singleGame,
      user: getState().auth.user
    })
    .then(response => {
      dispatch(gameContributeSucceed(response.data.updatedGame));

      return response;
    })
    .then(response => {
      dispatch(
        setBalanceSuccess({
          balance: response.data.balance
        })
      );
      return response;
    })
    .then(response => {
      dispatch(gameCardUpdateExecution(response.data.updatedGame));
      const socket = socketIOClient(config.socketEndpointHTTPS);
      socket.emit("gameCardUpdate", response.data.updatedGame);
      socket.emit("timerSync", response.data.updatedGame);
      return response.data;
    })

    .catch(error => {
      dispatch(gameContributeFailed(error.message));
    });
};

export const loadGames = () => (dispatch, getState) => {
  dispatch(loadGamesStart());
  return axios
    .get("/api/playground")
    .then(response => {
      dispatch(loadGamesSucceed(response.data.playground));
    })
    .catch(error => {
      dispatch(loadGamesFailed(error.message));
    });
};

const initialState = Immutable({
  gamesLoadingInProgress: false,
  gamesLoadingError: "",
  gamesLoadedAt: 0,
  gameContributionInProgress: false,
  gameContributionError: "",
  gameContributedAt: 0,
  lastContribute: 0,
  list: [],
  gameAutobettingSwitchCheckError: "",
  autobettingList: []
});

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_GAMES_START:
      return Immutable.merge(state, {
        gamesLoadingInProgress: true,
        gamesLoadingError: ""
      });

    case LOADING_GAMES_SUCCEED:
      return Immutable.merge(state, {
        gamesLoadedAt: action.fetchedAt,
        gamesLoadingInProgress: false,
        gamesLoadingError: "",
        list: action.playground
      });

    case LOADING_GAMES_FAILED:
      return Immutable.merge(state, {
        gamesLoadingInProgress: false,
        gamesLoadingError: action.error
      });

    case GAME_CONTRIBUTE_START:
      return Immutable.merge(state, {
        gameContributionInProgress: true,
        gameContributionError: ""
      });

    case GAME_CONTRIBUTE_SUCCEED:
      return Immutable.merge(state, {
        gameContributionInProgress: false,
        list: Immutable.flatMap(state.list, singleGame => {
          if (singleGame.humanId === action.game.humanId) {
            return {
              ...singleGame,
              currentPrice: action.game.currentPrice,
              winner: action.game.winner,
              lastClick: action.game.lastClick
            };
          } else {
            return singleGame;
          }
        })
      });

    case GAME_CONTRIBUTE_FAILED:
      return Immutable.merge(state, {
        gameContributionInProgress: false,
        gameContributionError: action.error
      });

    case GAME_DEMOLITION_EXECUTION:
      const games = [...state.list.asMutable()];
      return Immutable.merge(state, {
        list: Immutable(games.filter(g => g.humanId !== action.humanId))
      });
    case GAME_APPEAR_EXECUTION:
      const gamesList = [...state.list.asMutable(), action.newGame];
      return Immutable.merge(state, {
        list: Immutable(gamesList)
      });
    case GAME_STATUS_CHANGE_EXECUTION:
      return Immutable.merge(state, {
        list: Immutable.flatMap(state.list, game => {
          if (game.humanId === action.game.humanId) {
            return {
              ...game,
              status: action.newStatus
            };
          } else {
            return game;
          }
        })
      });

    case GAME_CARD_UPDATE_EXECUTION:
      return Immutable.merge(state, {
        list: Immutable.flatMap(state.list, game => {
          if (game.humanId === action.game.humanId) {
            return {
              ...game,
              winner: action.game.winner,
              currentPrice: action.game.currentPrice
            };
          } else {
            return game;
          }
        })
      });
    case CHECK_AUTOBETTING_SWITCH_EXECUTION_SUCCEED:
      const autobettingGames = [...state.autobettingList.asMutable()];
      autobettingGames.push(action.games);
      return Immutable.merge(state, {
        autobettingList: Immutable(autobettingGames)
      });
    case CHECK_AUTOBETTING_SWITCH_EXECUTION_FAILED:
      return Immutable.merge(state, {
        gameAutobettingSwitchCheckError: action.error
      });
    case GET_TIMERS_SUCCEED:
      return Immutable.merge(state, {
        list: Immutable.flatMap(state.list, game => {
          if (game._id === action.game) {
            return {
              ...game,
              timer: action.timer
            };
          } else {
            return game;
          }
        })
      });
    case GET_TIMERS_FAILED:
      return Immutable.merge(state, {
        getTimersExecutionFailed: action.error
      });
    case GAME_TIMER_SYNC_EXECUTION:
      return Immutable.merge(state, {
        list: Immutable.flatMap(state.list, game => {
          if (game.humanId === action.game.humanId) {
            return {
              ...game,
              timer: 0
            };
          } else {
            return game;
          }
        })
      });
    case PLAYGROUND_REFRESH:
      const allGames = [...state.list.asMutable()];
      const actGames = action.games;

      const actGamesIds = actGames.map(g => g.humanId);
      allGames.forEach((game, index) => {
        if (actGamesIds.includes(game.humanId)) {
          const refreshedGameIndex = actGames.findIndex(
            g => g.humanId === game.humanId
          );
          const refreshedGame = actGames[refreshedGameIndex];
          allGames[index] = refreshedGame;
        }
      });
      return Immutable.merge(state, {
        list: Immutable(allGames)
      });

    default:
      return state;
  }
}
