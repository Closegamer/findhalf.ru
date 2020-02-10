import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../../ducks/auth';
import injectSheet from 'react-jss';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import RecoveryForm from './RecoveryForm';
import signInImg from './../../img/signin.jpg';
import './style.css';

import { MDBContainer, MDBModal } from 'mdbreact';

export class Login extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      toggleLoginForm: PropTypes.func
    }).isRequired,
    showLoginForm: PropTypes.bool.isRequired,
    classes: PropTypes.objectOf(PropTypes.any).isRequired
  };

  state = {
    form: 'login'
  };

  toggleFormType = form => this.setState({ form });

  onLogin = values => {
    return this.props.actions.login(values).then(res => {
      if (res.success) {
        this.props.actions.toggleLoginForm();
      }
    });
  };

  onRegister = values => {
    return this.props.actions.registerUser(values).then(res => {
      if (res.success) {
        this.setState({ form: 'login' }, () =>
          this.props.actions.toggleLoginForm()
        );
      }
    });
  };

  onRecovery = values => {
    console.log(values);
  };

  render() {
    const { showLoginForm, classes, actions } = this.props;
    if (!showLoginForm) return null;
    const { form } = this.state;
    return (
      <MDBContainer fluid>
        <MDBModal
          isOpen={true}
          toggle={actions.toggleLoginForm}
          centered
          fade={false}
          contentClassName={classes.modalContent}
          //backdrop={false}
          //onClick={e => alert(1)}
        >
          {form === 'login' && (
            <LoginForm
              classes={classes}
              toggleFormType={this.toggleFormType}
              onSubmit={this.onLogin}
            />
          )}
          {form === 'register' && (
            <RegisterForm
              classes={classes}
              toggleFormType={this.toggleFormType}
              onSubmit={this.onRegister}
              initialValues={{ agree: true }}
            />
          )}
          {form === 'recovery' && (
            <RecoveryForm
              classes={classes}
              toggleFormType={this.toggleFormType}
              onSubmit={this.onRecovery}
            />
          )}
        </MDBModal>
      </MDBContainer>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  showLoginForm: auth.showLoginForm
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...authActions }, dispatch)
});

const styles = {
  modalContent: {
    padding: 0,
    backgroundColor: 'transparent'
  },

  overlay: {
    opacity: 0.5,
    transition: 'opacity .15s linear',
    backgroundColor: '#000',
    position: 'fixed',
    zIndex: 1040,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  form: {},

  card: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    backgroundImage: `url(${signInImg})`
  },

  link: {
    cursor: 'pointer'
  },

  customIcon: {
    color: 'red'
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(styles)(Login));
