import React, { Component } from "react";
import { connect } from "react-redux";
import { MDBSpinner, MDBCol, MDBRow, MDBContainer } from "mdbreact";
import { bindActionCreators } from "redux";
import * as playgroundActions from "../../../ducks/playground";
import * as balanceActions from "../../../ducks/balance";
import * as discountActions from "../../../ducks/discount";
import Single from "./Single";
// import "../styles.css";

export class Shop extends Component {
  static propTypes = {};

  componentDidMount() {
    const { gamesLoadedAt, playgroundActions } = this.props;
    if (!gamesLoadedAt) {
      setTimeout(() => {
        this.dispatchAutobetting();
      }, 100);
      setTimeout(
        playgroundActions => {
          playgroundActions.loadGames();
        },
        200,
        playgroundActions
      );
      setTimeout(() => {
        this.dispatchTimers();
      }, 300);
    }
  }

  dispatchTimers = () => {
    const { playgroundActions } = this.props;
    console.log("checking for timers... from playground");
    playgroundActions.getTimers();
  };

  dispatchAutobetting = () => {
    const { playgroundActions } = this.props;
    console.log("checking for autobettings... from playground");
    playgroundActions.checkAutobettingSwitch();
  };

  checkBalance = async () => {
    const { balanceActions } = this.props;
    const bal = await balanceActions.getBalance();
    if (bal) {
      balanceActions.setBalanceSuccess(bal);
    }
  };

  checkDiscount = async () => {
    const { discountActions } = this.props;
    const dis = await discountActions.getDiscount();
    if (dis) {
      discountActions.setDiscountSuccess(dis);
    }
  };

  render() {
    const {
      gamesLoadingInProgress,
      gamesLoadingError,
      isLoggedIn,
      currentUser
    } = this.props;

    const allGames = this.props.playground;

    const autobettingList = this.props.autobettingList[0];

    this.checkBalance();

    this.checkDiscount();

    if (!!gamesLoadingError) return <div>{gamesLoadingError}</div>;

    if (gamesLoadingInProgress) return <MDBSpinner />;

    const colStyle = {
      minHeight: 550,
      marginBottom: 25
    };

    return (
      <MDBContainer className="playground-cont" fluid>
        <MDBRow>
          {allGames.map((singleGame, index) => {
            return (
              <MDBCol
                xs="12"
                sm="4"
                md="3"
                lg="2"
                xl="2"
                key={index}
                style={colStyle}
              >
                <Single
                  singleGame={singleGame}
                  isLoggedIn={isLoggedIn}
                  index={index}
                  currentUser={currentUser}
                  autobettingList={autobettingList}
                />
              </MDBCol>
            );
          })}
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = ({ auth, playground }) => ({
  isLoggedIn: auth.isLoggedIn,
  currentUser: auth.user,
  playground: playground.list,
  gamesLoadingInProgress: playground.gamesLoadingInProgress,
  gamesLoadingError: playground.gamesLoadingError,
  gamesLoadedAt: playground.gamesLoadedAt,
  autobettingList: playground.autobettingList
});

const mapDispatchToProps = dispatch => ({
  playgroundActions: bindActionCreators({ ...playgroundActions }, dispatch),
  balanceActions: bindActionCreators({ ...balanceActions }, dispatch),
  discountActions: bindActionCreators({ ...discountActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
