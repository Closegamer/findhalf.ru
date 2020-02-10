import axios from "axios";
import Immutable from "seamless-immutable";

const socketIOClient = require("socket.io-client");
// import socketIOClient from "socket.io-client";
// import config from "../config.json";
const prefix = "games_for_admin";

const LOADING_GAMES_START = `${prefix}/LOADING_GAMES_START`;
const LOADING_GAMES_SUCCEED = `${prefix}/LOADING_GAMES_SUCCEED`;
const LOADING_GAMES_FAILED = `${prefix}/LOADING_GAMES_FAILED`;

const LOADING_GAME_START = `${prefix}/LOADING_GAME_START`;
const LOADING_GAME_SUCCEED = `${prefix}/LOADING_GAME_SUCCEED`;
const LOADING_GAME_FAILED = `${prefix}/LOADING_GAME_FAILED`;

const CREATING_GAME_START = `${prefix}/CREATING_GAME_START`;
const CREATING_GAME_SUCCEED = `${prefix}/CREATING_GAME_SUCCEED`;
const CREATING_GAME_FAILED = `${prefix}/CREATING_GAME_FAILED`;

const CHANGING_GAME_STATUS_START = `${prefix}/CHANGING_GAME_STATUS_START`;
const CHANGING_GAME_STATUS_SUCCEED = `${prefix}/CHANGING_GAME_STATUS_SUCCEED`;
const CHANGING_GAME_STATUS_FAILED = `${prefix}/CHANGING_GAME_STATUS_FAILED`;

const GAME_REACTOR_SWITCH_START = `${prefix}/GAME_REACTOR_SWITCH_START`;
const GAME_REACTOR_SWITCH_SUCCEED = `${prefix}/GAME_REACTOR_SWITCH_SUCCEED`;
const GAME_REACTOR_SWITCH_FAILED = `${prefix}/GAME_REACTOR_SWITCH_FAILED`;

const GAME_DEMOLITION_START = `${prefix}/GAME_DEMOLITION_START`;
const GAME_DEMOLITION_SUCCEED = `${prefix}/GAME_DEMOLITION_SUCCEED`;
const GAME_DEMOLITION_FAILED = `${prefix}/GAME_DEMOLITION_FAILED`;

const ADMIN_GAME_OVER_NOTICE = `${prefix}/ADMIN_GAME_OVER_NOTICE`;

const GAME_SET_AUTOBETTING_SUCCEED = `${prefix}/GAME_SET_AUTOBETTING_SUCCEED`;
const GAME_SET_AUTOBETTING_FAILED = `${prefix}/GAME_SET_AUTOBETTING_FAILED`;

// Loading

const loadGamesStart = () => ({
  type: LOADING_GAMES_START
});

const loadGamesSucceed = games => ({
  type: LOADING_GAMES_SUCCEED,
  games,
  fetchedAt: Date.now()
});

const loadGamesFailed = error => ({
  type: LOADING_GAMES_FAILED,
  error
});

// Creation

const createGameStart = () => ({
  type: CREATING_GAME_START
});

const createGameSucceed = game => ({
  type: CREATING_GAME_SUCCEED,
  game,
  fetchedAt: Date.now()
});

const createGameFailed = error => ({
  type: CREATING_GAME_FAILED,
  error
});

// Loading SINGLE

const loadGameStart = () => ({
  type: LOADING_GAME_START
});

const loadGameSucceed = game => ({
  type: LOADING_GAME_SUCCEED,
  game,
  fetchedAt: Date.now()
});

const loadGameFailed = error => ({
  type: LOADING_GAME_FAILED,
  error
});

// Changing Status

const gameStatusChangeStart = () => ({
  type: CHANGING_GAME_STATUS_START
});

const gameStatusChangeSucceed = ({ humanId, status }) => ({
  type: CHANGING_GAME_STATUS_SUCCEED,
  humanId,
  status
});

const gameStatusChangeFailed = error => ({
  type: CHANGING_GAME_STATUS_FAILED,
  error
});

// Reactor controls

const gameReactorSwitchStart = () => ({
  type: GAME_REACTOR_SWITCH_START
});

const gameReactorSwitchSucceed = (humanId, reactor) => ({
  type: GAME_REACTOR_SWITCH_SUCCEED,
  humanId,
  reactor
});

const gameReactorSwitchFailed = error => ({
  type: GAME_REACTOR_SWITCH_FAILED,
  error
});

// Game Demolition

const gameDemolitionStart = () => ({
  type: GAME_DEMOLITION_START
});

const gameDemolitionSucceed = humanId => ({
  type: GAME_DEMOLITION_SUCCEED,
  humanId,
  fetchedAt: Date.now()
});

const gameDemolitionFailed = error => ({
  type: GAME_DEMOLITION_FAILED,
  error
});

// Admin game over

const adminGameOverNoticeMake = (game, status) => ({
  type: ADMIN_GAME_OVER_NOTICE,
  game,
  status
});

// Game set autobetting

const setAutobettingSucceed = (gameId, position) => ({
  type: GAME_SET_AUTOBETTING_SUCCEED,
  gameId,
  position
});

const setAutobettingFailed = (game, position) => ({
  type: GAME_SET_AUTOBETTING_FAILED,
  game,
  position
});

export const gameOver = game => () => {
  return axios
    .post("/api/admin/games/gameover", {
      game
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log("gameover failed: ", error);
    });
};

export const setAutobetting = (game, position) => (dispatch, getState) => {
  return axios
    .post("/api/admin/games/setAutobetting", {
      game: game._id,
      user: getState().auth.user._id,
      hash: getState().auth.user._id + game._id,
      position
    })
    .then(response => {
      dispatch(setAutobettingSucceed(response.data));
      return response.data;
    })
    .catch(error => {
      dispatch(setAutobettingFailed(error.message));
    });
};

export const adminGameOverNotice = game => (dispatch, getState) => {
  return dispatch(adminGameOverNoticeMake(game, "closed"));
};

export const gameOverCheck = game => (dispatch, getState) => {
  return axios
    .post("/api/admin/games/gameover-check", {
      game
    })
    .then(response => {
      if (response.data.gameIsOver == true) {
        console.log("response.data.gameIsOver ", response.data.gameIsOver);
        dispatch(gameStatusChange(response.data.game, "closed"));
        dispatch(gameOver(response.data.game));
        dispatch(adminGameOverNotice(response.data.game));
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const gameReactorSwitch = (game, reactorSwitch) => (
  dispatch,
  getState
) => {
  dispatch(gameReactorSwitchStart());
  return axios
    .post("/api/admin/games/reactor-switch", {
      game,
      reactorSwitch: reactorSwitch
    })
    .then(response => {
      const humanId = response.data.humanId;
      const reactor = response.data.reactor;
      dispatch(gameReactorSwitchSucceed(humanId, reactor));
      return response.data;
    })
    .catch(error => {
      dispatch(gameReactorSwitchFailed(error.message));
    });
};

export const gameStatusChange = (game, newStatus) => (dispatch, getState) => {
  dispatch(gameStatusChangeStart());
  return axios
    .post("/api/admin/games/status-change", {
      game,
      humanId: game.humanId,
      newStatus: newStatus
    })
    .then(response => {
      dispatch(gameStatusChangeSucceed(response.data));
      if (newStatus === "paused" || newStatus === "closed") {
        dispatch(gameReactorSwitch(game, "off"));
      }
      return response.data;
    })
    .catch(error => {
      dispatch(gameStatusChangeFailed(error.message));
    });
};

export const loadGame = humanId => (dispatch, getState) => {
  dispatch(loadGameStart());
  return axios
    .get(`/api/admin/games/create/${humanId}`)
    .then(response => {
      dispatch(loadGameSucceed(response.data.loadedGame));
    })
    .catch(error => {
      dispatch(loadGameFailed(error.message));
    });
};

export const loadGames = () => (dispatch, getState) => {
  dispatch(loadGamesStart());
  return axios
    .get("/api/admin/games/list")
    .then(response => {
      dispatch(loadGamesSucceed(response.data.games));
    })
    .catch(error => {
      dispatch(loadGamesFailed(error.message));
    });
};

export const deleteGame = humanId => (dispatch, getState) => {
  dispatch(gameDemolitionStart());
  return axios
    .post(`/api/admin/games/delete/${humanId}`)
    .then(response => {
      dispatch(gameDemolitionSucceed(humanId));
    })
    .catch(error => {
      dispatch(gameDemolitionFailed(error.message));
    });
};

export const createGame = ({ bigPic, ...values }) => (dispatch, getState) => {
  dispatch(createGameStart());
  let formData = new FormData();

  for (var key in values) {
    formData.append(key, values[key]);
  }
  if (bigPic) {
    for (var i = 0; i < bigPic.length; i++) {
      formData.append("bigPic", bigPic[i], bigPic[i].name);
    }
  }
  return axios
    .post("/api/admin/games/create", formData)
    .then(response => {
      dispatch(createGameSucceed(response.data.game));
      return response.data;
    })
    .catch(error => {
      dispatch(createGameFailed(error.message));
    });
};

const initialState = Immutable({
  gamesLoadingInProgress: false,
  gamesLoadingError: "",
  gamesLoadedAt: 0,
  gameLoadingInProgress: false,
  gameLoadingError: "",
  gameLoadedAt: 0,
  gameCreationInProgress: false,
  gameCreationError: "",
  gameCreatedAt: 0,
  gameStatusChangingInProgress: false,
  gameStatusChangingError: "",
  gameStatusChangedAt: 0,
  gameDemolitionInProgress: false,
  gameDemolitionError: "",
  gameDemolitedAt: 0,
  loadedGame: false,
  gameSetAutobettingSucceed: false,
  gameSetAutobettingError: "",
  list: []
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
        list: action.games,
        gamesLoadedAt: action.fetchedAt,
        gamesLoadingInProgress: false,
        gamesLoadingError: ""
      });

    case LOADING_GAMES_FAILED:
      return Immutable.merge(state, {
        gamesLoadingInProgress: false,
        gamesLoadingError: action.error
      });

    case CREATING_GAME_START:
      return Immutable.merge(state, {
        gameCreationInProgress: true,
        gameCreationError: ""
      });

    case CREATING_GAME_SUCCEED:
      return Immutable.merge(state, {
        gameCreatedAt: action.fetchedAt,
        gameCreationInProgress: false,
        gameCreationError: ""
      });

    case CREATING_GAME_FAILED:
      return Immutable.merge(state, {
        gameCreationInProgress: false,
        gameCreationError: action.error
      });

    case LOADING_GAME_START:
      return Immutable.merge(state, {
        gameLoadingInProgress: true,
        gameLoadingError: ""
      });

    case LOADING_GAME_SUCCEED:
      return Immutable.merge(state, {
        loadedGame: action.game,
        gameLoadedAt: action.fetchedAt,
        gameLoadingInProgress: false,
        gameLoadingError: ""
      });

    case LOADING_GAME_FAILED:
      return Immutable.merge(state, {
        gameLoadingInProgress: false,
        gameLoadingError: action.error
      });

    case CHANGING_GAME_STATUS_START:
      return Immutable.merge(state, {
        gameStatusChangingInProgress: true,
        gameStatusChangingError: ""
      });

    case CHANGING_GAME_STATUS_SUCCEED:
      return Immutable.merge(state, {
        gameStatusChangingInProgress: false,
        list: Immutable.flatMap(state.list, game => {
          if (game.humanId === action.humanId) {
            if (action.status === "closed" || action.status === "paused") {
              return { ...game, status: action.status, reactor: "off" };
            } else {
              return { ...game, status: action.status };
            }
          } else {
            return game;
          }
        })
      });

    case CHANGING_GAME_STATUS_FAILED:
      return Immutable.merge(state, {
        gameStatusChangingInProgress: false,
        gameStatusChangingError: action.error
      });

    case GAME_REACTOR_SWITCH_START:
      return Immutable.merge(state, {
        gameReactorSwitchInProgress: true,
        gameReactorSwitchError: ""
      });

    case GAME_REACTOR_SWITCH_SUCCEED:
      return Immutable.merge(state, {
        gameReactorSwitchInProgress: false,
        list: Immutable.flatMap(state.list, game => {
          if (game.humanId === action.humanId) {
            return { ...game, reactor: action.reactor };
          } else {
            return game;
          }
        })
      });

    case GAME_REACTOR_SWITCH_FAILED:
      return Immutable.merge(state, {
        gameReactorSwitchInProgress: false,
        gameReactorSwitchError: action.error
      });

    case GAME_DEMOLITION_START:
      return Immutable.merge(state, {
        gameDemolitionInProgress: true,
        gameDemolitionError: ""
      });

    case GAME_DEMOLITION_SUCCEED:
      const games = [...state.list.asMutable()];
      return Immutable.merge(state, {
        gameDemolitionInProgress: false,
        list: Immutable(games.filter(g => g.humanId !== action.humanId))
      });

    case GAME_DEMOLITION_FAILED:
      return Immutable.merge(state, {
        gameDemolitionInProgress: false,
        gameDemolitionError: action.error
      });
    case ADMIN_GAME_OVER_NOTICE:
      return Immutable.merge(state, {
        list: Immutable.flatMap(state.list, game => {
          if (game.humanId === action.game.humanId) {
            return {
              ...game,
              status: action.status,
              winner: action.game.winner
            };
          } else {
            return game;
          }
        })
      });
    case GAME_SET_AUTOBETTING_SUCCEED:
      return Immutable.merge(state, {
        gameSetAutobettingSucceed: true,
        list: Immutable.flatMap(state.list, game => {
          if (game._id === action.gameId) {
            return {
              ...game,
              autoBetting: action.position
            };
          } else {
            return game;
          }
        })
      });
    case GAME_SET_AUTOBETTING_FAILED:
      return Immutable.merge(state, {
        gameSetAutobettingSucceed: false,
        gameSetAutobettingError: action.error
      });
    default:
      return state;
  }
}
