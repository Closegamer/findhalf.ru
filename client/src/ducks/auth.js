import React from 'react';
import axios from 'axios';
import Immutable from 'seamless-immutable';
import { SubmissionError } from 'redux-form';
import { toast, MDBIcon } from 'mdbreact';
import { getBalance } from './balance';

const prefix = 'auth';

// получить данные юзера
const LOADIND_USER_START = `${prefix}/LOADIND_USER_START`;
const LOADIND_USER_SUCCEED = `${prefix}/LOADIND_USER_SUCCEED`;
const LOADIND_USER_FAILED = `${prefix}/LOADIND_USER_FAILED`;
const LOADIND_USER_CANCELED = `${prefix}/LOADIND_USER_CANCELED`;

const loadUserStart = () => ({
  type: LOADIND_USER_START
});

const loadUserSucceed = user => ({
  type: LOADIND_USER_SUCCEED,
  user,
  fetchedAt: Date.now()
});

const loadUserFailed = error => ({
  type: LOADIND_USER_FAILED,
  error
});

const loadUserCanceled = () => ({
  type: LOADIND_USER_CANCELED
});

export const loadUser = () => (dispatch, getState) => {
  if (!localStorage.accessToken || !localStorage.refreshToken) {
    dispatch(loadUserCanceled());
    return;
  }

  dispatch(loadUserStart());
  return axios
    .get('/api/auth')
    .then(response => {
      dispatch(loadUserSucceed(response.data.user));
      dispatch(getBalance());
    })
    .catch(error => {
      dispatch(loadUserFailed(error.message));
    });
};

// регистрация
const REGISTER_USER_START = `${prefix}/REGISTER_USER_START`;
const REGISTER_USER_SUCCEED = `${prefix}/REGISTER_USER_SUCCEED`;

const registerUserStart = () => ({
  type: REGISTER_USER_START
});

const registerUserSucceed = () => ({
  type: REGISTER_USER_SUCCEED
});

export const registerUser = ({ nick, email, password }) => (
  dispatch,
  getState
) => {
  dispatch(registerUserStart());
  return axios
    .post('/api/users', {
      nick,
      email,
      password
    })
    .then(response => {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      dispatch(registerUserSucceed());
      dispatch(loadUser());
      toast.success(
        <span>
          <MDBIcon far icon='check-circle' /> Регистрация прошла успешно
        </span>,
        {
          closeButton: false,
          position: 'bottom-left'
        }
      );
      return response.data;
    })
    .catch(error => {
      throw new SubmissionError({ _error: error.response.data.error });
      //dispatch(registerUserFailed(error.message));
    });
};

// авторизация
const LOGIN_USER_START = `${prefix}/LOGIN_USER_START`;
const LOGIN_USER_SUCCEED = `${prefix}/LOGIN_USER_SUCCEED`;

const loginUserStart = () => ({
  type: LOGIN_USER_START
});

const loginUserSucceed = () => ({
  type: LOGIN_USER_SUCCEED
});

export const login = ({ email, password }) => (dispatch, getState) => {
  dispatch(loginUserStart());
  return axios
    .post('/api/auth', {
      email,
      password
    })
    .then(response => {
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      dispatch(loginUserSucceed());
      dispatch(loadUser());
      toast.success(
        <span>
          <MDBIcon far icon='check-circle' /> Вы успешно вошли в свой аккаунт
        </span>,
        {
          closeButton: false,
          position: 'bottom-left'
        }
      );
      return response.data;
    })
    .catch(error => {
      throw new SubmissionError({ _error: error.response.data.error });
      //dispatch(registerUserFailed(error.message));
    });
};

// Выход
const LOGOUT_USER_SUCCEED = `${prefix}/LOGOUT_USER_SUCCEED`;
const LOGOUT_USER_WITH_ERROR = `${prefix}/LOGOUT_USER_WITH_ERROR`;

const logoutUserSucceed = () => ({
  type: LOGOUT_USER_SUCCEED
});

const logoutUserWithError = () => ({
  type: LOGOUT_USER_WITH_ERROR
});

export const logout = () => dispatch => {
  return axios
    .get('/api/auth/logout')
    .then(response => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(logoutUserSucceed());
      toast.warn(
        <span style={{ color: 'black' }}>
          <MDBIcon far icon='check-circle' /> Вы вышли из своего аккаунта
        </span>,
        {
          closeButton: false,
          position: 'bottom-left'
        }
      );
    })
    .catch(error => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(logoutUserWithError());
    });
};

const TOGGLE_LOGIN_FORM = `${prefix}/TOGGLE_LOGIN_FORM`;

export const toggleLoginForm = dispatch => {
  return dispatch => dispatch({ type: TOGGLE_LOGIN_FORM });
};

const initialState = Immutable({
  showLoginForm: false,
  isLoggedIn: false,
  userLoadingInProgress: false,
  userLoadingError: '',
  userLoadedAt: 0,
  user: {},
  registerUserInProgress: false,
  loginUserInProgress: false
});

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_LOGIN_FORM:
      return Immutable.merge(state, { showLoginForm: !state.showLoginForm });

    case LOADIND_USER_START:
      return Immutable.merge(state, {
        userLoadingInProgress: true,
        userLoadingError: ''
      });

    case LOADIND_USER_SUCCEED:
      return Immutable.merge(state, {
        user: action.user,
        userLoadedAt: action.fetchedAt,
        userLoadingInProgress: false,
        isLoggedIn: true,
        showLoginForm: false
      });

    case LOADIND_USER_FAILED:
      return Immutable.merge(state, {
        userLoadingInProgress: false,
        userLoadingError: action.error,
        isLoggedIn: false
      });

    case REGISTER_USER_START:
      return Immutable.merge(state, {
        registerUserInProgress: true
      });

    case REGISTER_USER_SUCCEED:
      return Immutable.merge(state, {
        registerUserInProgress: false
      });

    case LOGIN_USER_START:
      return Immutable.merge(state, {
        loginUserInProgress: true
      });
    case LOGIN_USER_SUCCEED:
      return Immutable.merge(state, {
        loginUserInProgress: false
      });

    case LOGOUT_USER_SUCCEED:
      return Immutable.merge(state, {
        isLoggedIn: false,
        userLoadingInProgress: false,
        userLoadingError: '',
        userLoadedAt: 0,
        user: {}
      });
    case LOGOUT_USER_WITH_ERROR:
      return Immutable.merge(state, {
        isLoggedIn: false,
        userLoadingInProgress: false,
        userLoadingError: '',
        userLoadedAt: 0,
        user: {}
      });

    default:
      return state;
  }
}
