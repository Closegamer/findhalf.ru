import React from "react";
import Immutable from "seamless-immutable";
import axios from "axios";
import { SubmissionError } from "redux-form";
import { toast, MDBIcon } from "mdbreact";

const prefix = "balance";

const TOGGLE_BALANCE_FORM = `${prefix}/TOGGLE_BALANCE_FORM`;

export const toggleBalanceForm = () => dispatch => {
  dispatch({
    type: TOGGLE_BALANCE_FORM
  });
};

const GET_BALANCE_START = `${prefix}/GET_BALANCE_START`;
const GET_BALANCE_SUCCESS = `${prefix}/GET_BALANCE_SUCCESS`;
const GET_BALANCE_ERROR = `${prefix}/GET_BALANCE_ERROR`;

const getBalanceStart = () => ({
  type: GET_BALANCE_START
});

const getBalanceSuccess = data => ({
  type: GET_BALANCE_SUCCESS,
  balance: data.balance,
  fetchedAt: Date.now()
});

const getBalanceFail = error => ({
  type: GET_BALANCE_ERROR,
  error: error.message
});

export const getBalance = () => dispatch => {
  console.log("balance duck: getBalance");
  dispatch(getBalanceStart());
  return axios
    .get("/api/users/balance")
    .then(response => {
      if (!response.data.success) {
        throw new Error(response.data.error);
      } else {
        dispatch(getBalanceSuccess(response.data));

        return response.data;
      }
    })
    .catch(error => {
      dispatch(getBalanceFail(error));
    });
};

const SET_BALANCE_SUCCESS = `${prefix}/SET_BALANCE_SUCCESS`;

export const setBalanceSuccess = data => ({
  type: SET_BALANCE_SUCCESS,
  balance: data.balance,
  fetchedAt: Date.now()
});

export const setBalance = ({ balance }) => dispatch => {
  // console.log('balance duck: setBalance: ', balance);
  return axios
    .post("/api/users/balance", {
      balance
    })
    .then(response => {
      if (!response.data.success) {
        throw new Error(response.data.error);
      } else {
        dispatch(setBalanceSuccess(response.data));
        toast.success(
          <span>
            <MDBIcon far icon="check-circle" /> баланс пополнен на {balance}
          </span>,
          {
            closeButton: false,
            position: "bottom-left"
          }
        );
        return response.data;
      }
    })
    .catch(error => {
      throw new SubmissionError({ _error: error.response.data.error });
    });
};

const initialState = Immutable({
  showBalanceForm: false,
  value: 0,
  balanceIsLoading: false,
  balanceError: "",
  fetchedAt: 0
});

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_BALANCE_FORM:
      return Immutable.merge(state, {
        showBalanceForm: !state.showBalanceForm
      });
    case GET_BALANCE_START:
      return Immutable.merge(state, {
        balanceIsLoading: true,
        balanceError: ""
      });
    case GET_BALANCE_SUCCESS:
      return Immutable.merge(state, {
        balanceIsLoading: false,
        balanceError: "",
        value: action.balance,
        fetchedAt: action.fetchedAt
      });
    case GET_BALANCE_ERROR:
      return Immutable.merge(state, {
        balanceIsLoading: false,
        balanceError: action.error
      });

    case SET_BALANCE_SUCCESS:
      return Immutable.merge(state, {
        value: action.balance,
        fetchedAt: action.fetchedAt
      });
    default:
      return state;
  }
}
