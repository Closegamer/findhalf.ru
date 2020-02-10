import React, { Component, useEffect } from "react";
import { BrowserRouter as Router, IndexRoute } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Navigator from "./containers/Navigator";
import LoginForm from "./containers/Login";
import BalanceForm from "./containers/Balance";
import Routes from "./Routes";
import setInterceptors from "./utils/setInterceptors";
import { loadUser } from "./ducks/auth";
import * as playgroundActions from "./ducks/playground";
import * as gameActions from "./ducks/games";
import { ToastContainer } from "mdbreact";

import "./App.css";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import config from "./config.json";

setInterceptors();

export class App extends Component {
  constructor() {
    super();
    this.state = {
      endpointHTTP: config.socketEndpointHTTP,
      endpointHTTPS: config.socketEndpointHTTPS
    };
  }

  componentDidMount() {
    store.dispatch(loadUser());

    const endpoint =
      window.location.protocol === "https:"
        ? this.state.endpointHTTPS
        : this.state.endpointHTTP;
    const socket = socketIOClient(endpoint);

    socket.on("alert", msg => {
      alert(msg);
    });
    socket.on("gameAppear", game => {
      store.dispatch(playgroundActions.gameAppear(game));
    });
    socket.on("gameDemolition", humanId => {
      store.dispatch(playgroundActions.gameDemolition(humanId));
    });
    socket.on("gameStatusChange", shuttle => {
      store.dispatch(
        playgroundActions.gameStatusChange(shuttle[0], shuttle[1])
      );
    });
    socket.on("gameCardUpdate", game => {
      store.dispatch(playgroundActions.gameCardUpdate(game));
    });
    socket.on("adminGameOverNotice", game => {
      store.dispatch(gameActions.gameOver(game));
      store.dispatch(gameActions.adminGameOverNotice(game));
    });
    socket.on("timerSync", game => {
      store.dispatch(playgroundActions.timerSync(game));
    });
    socket.on("playgroundRefresh", games => {
      store.dispatch(playgroundActions.refresh(games));
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="app">
            <Navigator />
            <Routes />
            <LoginForm />
            <BalanceForm />
            <ToastContainer
              hideProgressBar={true}
              newestOnTop={true}
              autoClose={3000}
            />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
