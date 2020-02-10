import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as balanceActions from "../../ducks/balance";
import injectSheet from "react-jss";
import Form from "./Form";

import signInImg from "./../../img/signin.jpg";

import "./style.css";

import { MDBContainer, MDBModal } from "mdbreact";

export class Balance extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      toggleBalanceForm: PropTypes.func
    }).isRequired,
    showBalanceForm: PropTypes.bool.isRequired,
    classes: PropTypes.objectOf(PropTypes.any).isRequired
  };

  onBalanceSubmit = async values => {
    return this.props.actions.setBalance(values).then(res => {
      if (res.success) {
        this.props.actions.toggleBalanceForm();
      }
    });
  };

  render() {
    const { showBalanceForm, classes, actions } = this.props;
    // console.log(showBalanceForm);
    if (!showBalanceForm) return null;

    return (
      <MDBContainer fluid>
        <MDBModal
          isOpen={true}
          toggle={actions.toggleBalanceForm}
          centered
          fade={false}
          contentClassName={classes.modalContent}
          //backdrop={false}
          //onClick={e => alert(1)}
        >
          <Form classes={classes} onSubmit={this.onBalanceSubmit} />
        </MDBModal>
      </MDBContainer>
    );
  }
}

const mapStateToProps = ({ balance }) => ({
  showBalanceForm: balance.showBalanceForm
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...balanceActions }, dispatch)
});

const styles = {
  modalContent: {
    padding: 0,
    backgroundColor: "transparent"
  },

  overlay: {
    opacity: 0.5,
    transition: "opacity .15s linear",
    backgroundColor: "#000",
    position: "fixed",
    zIndex: 1040,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  form: {},

  card: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    backgroundImage: `url(${signInImg})`
  },

  link: {
    cursor: "pointer"
  },

  customIcon: {
    color: "red"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(styles)(Balance));
