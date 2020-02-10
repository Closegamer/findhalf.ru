import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Countdown, { zeroPad } from "react-countdown-now";
import socketIOClient from "socket.io-client";
// import { Field, reduxForm, formValueSelector } from 'redux-form';
// import { CheckBoxField } from '../../../fields';
import {
  MDBCard,
  MDBCardUp,
  MDBCardBody,
  MDBRotatingCard,
  MDBIcon,
  MDBBtn,
  MDBAlert,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBSwitch
} from "mdbreact";
import * as playgroundActions from "../../../ducks/playground";
import * as balanceActions from "../../../ducks/balance";
import * as gamesActions from "../../../ducks/games";
import "../styles.css";
import store from "../../../store";
import config from "../../../config.json";

class Single extends Component {
  static defaultProps = {
    timer: 0
  };

  state = {
    flipped: false,
    endpointHTTP: config.socketEndpointHTTP,
    endpointHTTPS: config.socketEndpointHTTPS,
    switchOn: false
  };

  componentDidMount(getState) {
    const { autobettingList, singleGame } = this.props;
    if (autobettingList) {
      // console.log("autobettingList", autobettingList);
      for (var i = 0; i < autobettingList.length; i++) {
        if (autobettingList[i].game === singleGame._id) {
          this.setState({ switchOn: true });
        }
      }
    }
  }

  handleFlipping = () => {
    this.setState({ flipped: !this.state.flipped });
    // const singleGame = this.props.game;
    // console.log("handle: ", singleGame);
    // const socket = socketIOClient(this.state.endpoint);
    // socket.emit("timerSync", singleGame);
  };

  contribute = singleGame => {
    // console.log("contribute");
    const { playgroundActions } = this.props;
    playgroundActions.gameContribution(singleGame._id);

    this.setState({ timer: 0 });
  };

  cardUpdateSocket = singleGame => {
    const endpoint =
      window.location.protocol === "https:"
        ? this.state.endpointHTTPS
        : this.state.endpointHTTP;
    const socket = socketIOClient(endpoint);
    socket.emit("gameCardUpdate", singleGame);
    socket.emit("timerSync", singleGame);
  };

  toCart = values => {
    console.log("item is in cart: ", values);
  };

  render() {
    // console.log("render Single");
    const { isLoggedIn, singleGame, currentUser, autobettingList } = this.props;

    let { switchOn } = this.state;

    const index = this.props.index;

    const uploadDir = config.uploadDir;

    const colStyle = {
      height: 530,
      fontSize: 12
    };

    return (
      <MDBRotatingCard
        flipped={this.state.flipped}
        className="text-center"
        style={colStyle}
      >
        <MDBCard className="face front">
          <MDBCardBody className="blackText">
            <img
              className="card-img-top"
              src={`${uploadDir}${singleGame.bigPic.guid}${singleGame.bigPic.ext}`}
              alt={singleGame.caption}
            />
            <p></p>
            <h4 className="font-weight-bold mb-3">{singleGame.caption}</h4>
            <p className="cardCurrentPrice">{singleGame.marketPrice} руб.</p>
            <MDBBtn
              className="cartBtn"
              color="success"
              onClick={e => this.toCart(singleGame)}
            >
              В корзину
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBRotatingCard>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  gameActions: bindActionCreators({ ...gamesActions }, dispatch),
  playgroundActions: bindActionCreators({ ...playgroundActions }, dispatch),
  balanceActions: bindActionCreators({ ...balanceActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Single);
