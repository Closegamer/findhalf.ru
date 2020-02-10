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

  handleSwitchChange = () => {
    const { singleGame } = this.props;
    const { switchOn } = this.state;
    this.setState(
      {
        switchOn: !switchOn
      },
      () => this.handleChange(singleGame, switchOn)
    );
  };

  handleChange = (singleGame, position) => {
    let switchPositionOn = false;
    if (position) {
      switchPositionOn = true;
    }

    if (!switchPositionOn) {
      this.setAutobetting(singleGame);
    } else {
      this.unsetAutobetting(singleGame);
    }
  };

  setAutobetting = singleGame => {
    const endpoint =
      window.location.protocol === "https:"
        ? this.state.endpointHTTPS
        : this.state.endpointHTTP;
    const socket = socketIOClient(endpoint);
    const { gameActions } = this.props;
    // console.log("single setAutobetting");
    gameActions.setAutobetting(singleGame, true);
    socket.emit("timerSync", singleGame);
  };

  unsetAutobetting = singleGame => {
    const endpoint =
      window.location.protocol === "https:"
        ? this.state.endpointHTTPS
        : this.state.endpointHTTP;
    const socket = socketIOClient(endpoint);
    const { gameActions } = this.props;
    // console.log("single unsetAutobetting");
    gameActions.setAutobetting(singleGame, false);
    socket.emit("timerSync", singleGame);
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

    const timerRenderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        return <WhenTimerIsOver />;
      } else {
        return (
          <MDBContainer className="timerFiguresCont">
            <MDBRow className="timerLabel">
              {/* <MDBCol>часы</MDBCol> */}
              <MDBCol>минуты</MDBCol>
              <MDBCol>секунды</MDBCol>
            </MDBRow>
            <MDBRow>
              {/* <MDBCol className='countdownHrs'>{hours}</MDBCol> */}
              <MDBCol className="countdownMin">{minutes}</MDBCol>
              <MDBCol className="countdownSec">{seconds}</MDBCol>
            </MDBRow>
          </MDBContainer>
        );
      }
    };

    const WhenTimerIsOver = () => {
      const { gameActions } = this.props;
      gameActions.gameOverCheck(singleGame);
      return true;
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
            <p className="cardGameHumanId">№: {singleGame.humanId}</p>
            <p className="cardCurrentPrice">
              Текущая цена:
              <br />
              {singleGame.currentPrice} руб.
            </p>
            {/* <p className='font-weight-bold blue-text'>
              Рыночная цена: {singleGame.marketPrice} руб.
            </p> */}
            {/* <p className="cardFontColor">
              Период:
              <br />
              {singleGame.duration} сек
            </p> */}
            {singleGame.status === "holded" && (
              <p className="cardFontColor">
                На финише:
                <br />
                <span className="cardWinner">{singleGame.winner}</span>
              </p>
            )}
            {singleGame.status === "opened" && (
              <p className="cardFontColor">
                На финише:
                <br />
                <span className="cardWinner">{singleGame.winner}</span>
              </p>
            )}
            {singleGame.status === "paused" && (
              <p className="cardFontColor">
                На финише:
                <br />
                <span className="cardWinner">{singleGame.winner}</span>
              </p>
            )}
            {singleGame.status === "closed" && (
              <React.Fragment>
                <p className="cardFontColor">
                  Победил:
                  <br />
                  <span className="cardWinner">{singleGame.winner}</span>
                </p>
                <p className="cardFontColor">
                  Скидка составила:
                  <br />
                  {singleGame.marketPrice - singleGame.currentPrice} руб. или{" "}
                  {(
                    100 -
                    (singleGame.currentPrice / singleGame.marketPrice) * 100
                  ).toFixed(2)}{" "}
                  %
                </p>
              </React.Fragment>
            )}

            {/* <a
              href="#!"
              className="rotate-btn cardFontColor"
              data-card={`card-${index}`}
              onClick={this.handleFlipping}
            >
              <MDBIcon icon="redo" /> Подробности...
            </a> */}
          </MDBCardBody>
          {singleGame.status === "opened" && (
            <React.Fragment>
              <Countdown
                date={
                  Date.now() + (singleGame.duration - singleGame.timer) * 1000
                }
                precision={3}
                intervalDelay={0}
                zeroPadTime={2}
                daysInHours={false}
                controlled={false}
                renderer={timerRenderer}
              />
              <div className="text-right">
                {singleGame.autoBetting === "Да" &&
                  isLoggedIn &&
                  currentUser.balance > singleGame.betSize && (
                    <MDBSwitch
                      checked={switchOn}
                      getValue={this.handleSwitchChange}
                      labelLeft={"Автомат"}
                      labelRight={""}
                      className="switchAutobetting"
                    />
                  )}
                {singleGame.autoBetting === "Да" &&
                  isLoggedIn &&
                  currentUser.balance < singleGame.betSize && (
                    <MDBSwitch
                      checked={switchOn}
                      getValue={this.handleSwitchChange}
                      labelLeft={"Автомат"}
                      labelRight={""}
                      disabled
                      className="switchAutobetting"
                    />
                  )}
                {singleGame.autoBetting === "Да" && !isLoggedIn && (
                  <MDBSwitch
                    checked={switchOn}
                    getValue={this.handleSwitchChange}
                    labelLeft={"Автомат"}
                    labelRight={""}
                    disabled
                    className="switchAutobetting"
                  />
                )}
                {singleGame.autoBetting === "Нет" && (
                  <MDBSwitch
                    disabled
                    checked={false}
                    labelLeft={"Автомат недоступен"}
                    labelRight={""}
                    className="switchAutobetting"
                  />
                )}
              </div>

              {singleGame.status !== "closed" &&
                isLoggedIn &&
                currentUser.balance > singleGame.betSize && (
                  <MDBBtn
                    color="success"
                    onClick={e => this.contribute(singleGame)}
                  >
                    Участвовать
                  </MDBBtn>
                )}

              {singleGame.status !== "closed" && !isLoggedIn && (
                <MDBBtn
                  color="success"
                  disabled
                  onClick={e => this.contribute(singleGame)}
                >
                  Вы не авторизованы
                </MDBBtn>
              )}
              {singleGame.status !== "closed" &&
                isLoggedIn &&
                currentUser.balance < singleGame.betSize && (
                  <MDBBtn
                    color="success"
                    disabled
                    onClick={e => this.contribute(singleGame)}
                  >
                    Недостаточно средств
                  </MDBBtn>
                )}
            </React.Fragment>
          )}
          {singleGame.status === "holded" && (
            <MDBAlert color="warning">СКОРО НАЧАЛО!</MDBAlert>
          )}
          {singleGame.status === "paused" && (
            <MDBAlert color="dark">ОСТАНОВЛЕНО</MDBAlert>
          )}
          {singleGame.status === "closed" && (
            <MDBAlert color="danger">РОЗЫГРЫШ ОКОНЧЕН</MDBAlert>
          )}
          {singleGame.status === "closed" && singleGame.winner === currentUser && (
            <MDBBtn
              color="success"
              // onClick={e => this.contribute(singleGame)}
            >
              Купить за {singleGame.currentPrice} руб.
            </MDBBtn>
          )}
        </MDBCard>
        <MDBCard className="face back">
          <MDBCardUp>
            <img
              className="card-img-top"
              src={`${uploadDir}${singleGame.bigPic.guid}${singleGame.bigPic.ext}`}
              alt={singleGame.caption}
            />
          </MDBCardUp>
          <MDBCardBody>
            <h4 className="font-weight-bold">{singleGame.caption}</h4>
            <hr />
            <p>Рыночная цена: {singleGame.marketPrice} руб.</p>
            <p>Текущая цена: {singleGame.currentPrice} руб.</p>
            <p>Описание товара: {singleGame.description}</p>
            <p>Цена участия в аукционе: {singleGame.betSize} руб.</p>
            <p>Шаг поднятия цены: {singleGame.singleStep} руб.</p>
            <MDBBtn
              color="success"
              onClick={e => this.toCart(singleGame.humanId)}
              outline
            >
              Купить за <br />
              {singleGame.marketPrice} рублей
            </MDBBtn>
            <hr />

            <a
              href="#!"
              className="rotate-btn"
              data-card={`card-${index}`}
              onClick={this.handleFlipping}
            >
              <MDBIcon icon="undo" /> Купить за меньшую цену
            </a>
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
