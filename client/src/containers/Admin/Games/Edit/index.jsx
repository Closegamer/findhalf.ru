import React, { Component } from "react";
import { connect } from "react-redux";
import { MDBSpinner, MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { bindActionCreators } from "redux";
import socketIOClient from "socket.io-client";
import * as gamesActions from "../../../../ducks/games";
import * as playgroundActions from "../../../../ducks/playground";
import Form from "./Form";
import "../../styles.css";
import config from "../../../../config.json";

export class Edit extends Component {
  constructor() {
    super();
    this.state = {
      endpointHTTP: config.socketEndpointHTTP,
      endpointHTTPS: config.socketEndpointHTTPS
    };
  }
  static propTypes = {};

  componentDidMount() {
    const { actions, match } = this.props;

    const humanId = match.params.humanId;
    if (humanId) {
      actions.loadGame(humanId);
    }
  }

  onSubmit = values => {
    const { actions, history } = this.props;
    const endpoint =
      window.location.protocol === "https:"
        ? this.state.endpointHTTPS
        : this.state.endpointHTTP;
    const socket = socketIOClient(endpoint);

    return actions.createGame(values).then(result => {
      if (result.success) {
        history.replace("/admin/games/list");
        socket.emit("gameAppear", result.game);
      }
    });
  };

  render() {
    const { loadedGame, loadedGameInProgress, match } = this.props;

    const humanId = match.params.humanId;

    if (!!humanId && (!loadedGame || loadedGameInProgress)) {
      return <MDBSpinner />;
    }

    let initialValues = null;
    if (humanId && loadedGame) {
      initialValues = loadedGame;
    } else {
      initialValues = {
        duration: "30",
        autoBetting: "Да",
        betSize: "10",
        singleStep: 1
      };
    }
    return (
      <div className="monitor-cont">
        {humanId && <h3>Редактировать игру</h3>}
        {!humanId && <h3>Новая</h3>}
        <MDBContainer>
          <MDBRow>
            <MDBCol size="4">
              <Form onSubmit={this.onSubmit} initialValues={initialValues} />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

const mapStateToProps = ({ games }) => ({
  gameCreationInProgress: games.gameCreationInProgress,
  gameCreationError: games.gameCreationError,
  gameCreatedAt: games.gameCreatedAt,

  loadedGame: games.loadedGame,
  loadedGameInProgress: games.loadedGameInProgress
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...gamesActions }, dispatch),
  playgroundActions: bindActionCreators({ ...playgroundActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
