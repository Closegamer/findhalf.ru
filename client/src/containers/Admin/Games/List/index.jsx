import React, { Component } from "react";
import { connect } from "react-redux";
import { MDBBtn, MDBSpinner, MDBAlert, MDBIcon } from "mdbreact";
import { bindActionCreators } from "redux";
import * as gamesActions from "../../../../ducks/games";
import * as playgroundActions from "../../../../ducks/playground";
import socketIOClient from "socket.io-client";
import "../../styles.css";
import store from "../../../../store";
import config from "../../../../config.json";

const uploadDir = config.uploadDir;

export class List extends Component {
  constructor() {
    super();
    this.state = {
      endpointHTTP: config.socketEndpointHTTP,
      endpointHTTPS: config.socketEndpointHTTPS
    };
  }
  static propTypes = {};

  componentDidMount() {
    const { gamesActions } = this.props;
    gamesActions.loadGames();
  }

  statusChange = (game, newStatus) => {
    const { gamesActions } = this.props;
    gamesActions.gameStatusChange(game, newStatus);

    const endpoint =
      window.location.protocol === "https:"
        ? this.state.endpointHTTPS
        : this.state.endpointHTTP;
    const socket = socketIOClient(endpoint);
    const shuttle = [game, newStatus];
    socket.emit("gameStatusChange", shuttle);
  };

  deleteCurrentGame = humanId => {
    const { gamesActions } = this.props;
    gamesActions.deleteGame(humanId);

    const endpoint =
      window.location.protocol === "https:"
        ? this.state.endpointHTTPS
        : this.state.endpointHTTP;
    const socket = socketIOClient(endpoint);
    socket.emit("gameDemolition", humanId);
  };

  reactorSwitch = (game, reactorSwitch) => {
    const { gamesActions } = this.props;
    gamesActions.gameReactorSwitch(game, reactorSwitch);
  };

  render() {
    const { games, gamesLoadingInProgress, gamesLoadingError } = this.props;

    if (!!gamesLoadingError) return <div>{gamesLoadingError}</div>;

    if (gamesLoadingInProgress) return <MDBSpinner />;

    return (
      <React.Fragment>
        {!games[0] ? (
          <div>Нету</div>
        ) : (
          <div className="monitor-cont">
            <h4>Все Игры</h4>
            <table className="table table-striped text-center">
              <thead>
                <tr>
                  <th scope="col">HumanId</th>
                  <th scope="col">BigPic</th>
                  <th scope="col">Caption</th>
                  <th scope="col">MarketPrice</th>
                  <th scope="col">CurrentPrice</th>
                  <th scope="col">TotalIncome</th>
                  <th scope="col">Status</th>
                  <th scope="col">Duration</th>
                  <th scope="col">BetSize</th>
                  <th scope="col">SingleStep</th>
                  <th scope="col">AutoBetting</th>
                  <th scope="col">Timer</th>
                  <th scope="col">Winner</th>
                  <th scope="col">Reactor</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game, index) => {
                  return (
                    <tr key={index}>
                      <td>{game.humanId}</td>
                      <td>
                        {game.bigPic && game.bigPic.guid && game.bigPic.ext && (
                          <img
                            alt={game.caption}
                            width={90}
                            height={90}
                            src={`${uploadDir}${game.bigPic.guid}${game.bigPic.ext}`}
                          />
                        )}
                      </td>
                      <td>{game.caption}</td>
                      <td>{game.marketPrice}</td>
                      <td>{game.currentPrice}</td>
                      <td>{game.totalIncome}</td>
                      <td>{game.status}</td>
                      <td>{game.duration}</td>
                      <td>{game.betSize}</td>
                      <td>{game.singleStep}</td>
                      <td>{game.autoBetting}</td>
                      <td>hserh</td>
                      <td>{game.winner}</td>
                      <td>
                        {game.reactor === "on" &&
                          game.status !== "closed" &&
                          game.autoBetting === "Да" && (
                            <MDBBtn
                              color="success"
                              rounded
                              size="sm"
                              onClick={e => this.reactorSwitch(game, "off")}
                            >
                              стоп
                            </MDBBtn>
                          )}
                        {game.reactor === "off" &&
                          game.status !== "closed" &&
                          game.autoBetting === "Да" && (
                            <MDBBtn
                              color="danger"
                              rounded
                              size="sm"
                              onClick={e => this.reactorSwitch(game, "on")}
                            >
                              пуск
                            </MDBBtn>
                          )}
                        {!game.reactor && (
                          <MDBAlert color="warning">Problems!</MDBAlert>
                        )}
                      </td>
                      <td>
                        {game.status === "holded" && (
                          <React.Fragment>
                            <MDBBtn
                              color="dark-green"
                              rounded
                              size="sm"
                              onClick={e => this.statusChange(game, "opened")}
                            >
                              <MDBIcon icon="play" />
                            </MDBBtn>
                            <MDBBtn
                              color="blue-grey"
                              rounded
                              disabled
                              outline
                              size="sm"
                            >
                              <MDBIcon icon="pause" />
                            </MDBBtn>
                            <MDBBtn
                              disabled
                              color="pink"
                              rounded
                              size="sm"
                              outline
                            >
                              <MDBIcon icon="stop" />
                            </MDBBtn>
                          </React.Fragment>
                        )}
                        {game.status === "opened" && (
                          <React.Fragment>
                            <MDBBtn
                              color="dark-green"
                              rounded
                              outline
                              disabled
                              size="sm"
                            >
                              <MDBIcon icon="play" />
                            </MDBBtn>
                            <MDBBtn
                              color="blue-grey"
                              rounded
                              size="sm"
                              onClick={e => this.statusChange(game, "paused")}
                            >
                              <MDBIcon icon="pause" />
                            </MDBBtn>
                            <MDBBtn
                              color="pink"
                              rounded
                              size="sm"
                              onClick={e => this.statusChange(game, "closed")}
                            >
                              <MDBIcon icon="stop" />
                            </MDBBtn>
                          </React.Fragment>
                        )}
                        {game.status === "paused" && (
                          <React.Fragment>
                            <MDBBtn
                              color="dark-green"
                              rounded
                              size="sm"
                              onClick={e => this.statusChange(game, "opened")}
                            >
                              <MDBIcon icon="play" />
                            </MDBBtn>
                            <MDBBtn
                              color="blue-grey"
                              rounded
                              outline
                              disabled
                              size="sm"
                            >
                              <MDBIcon icon="pause" />
                            </MDBBtn>
                            <MDBBtn
                              color="pink"
                              rounded
                              size="sm"
                              onClick={e => this.statusChange(game, "closed")}
                            >
                              <MDBIcon icon="stop" />
                            </MDBBtn>
                          </React.Fragment>
                        )}
                        {game.status === "closed" && (
                          <React.Fragment>
                            <MDBBtn
                              color="red"
                              rounded
                              size="sm"
                              onClick={e =>
                                this.deleteCurrentGame(game.humanId)
                              }
                            >
                              <MDBIcon icon="times" />
                            </MDBBtn>
                          </React.Fragment>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ games }) => ({
  games: games.list,
  gamesLoadingInProgress: games.gamesLoadingInProgress,
  gamesLoadingError: games.gamesLoadingError,
  gamesLoadedAt: games.gamesLoadedAt
});

const mapDispatchToProps = dispatch => ({
  gamesActions: bindActionCreators({ ...gamesActions }, dispatch),
  playgroundActions: bindActionCreators({ ...playgroundActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
