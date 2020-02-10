import React from "react";
import Immutable from "seamless-immutable";
import axios from "axios";
import { SubmissionError } from "redux-form";
import { toast, MDBIcon } from "mdbreact";

const prefix = "discount";

const GET_DISCOUNT_START = `${prefix}/GET_DISCOUNT_START`;
const GET_DISCOUNT_SUCCESS = `${prefix}/GET_DISCOUNT_SUCCESS`;
const GET_DISCOUNT_ERROR = `${prefix}/GET_DISCOUNT_ERROR`;

const getDiscountStart = () => ({
  type: GET_DISCOUNT_START
});

const getDiscountSuccess = data => ({
  type: GET_DISCOUNT_SUCCESS,
  discount: data.balance,
  fetchedAt: Date.now()
});

const getDiscountFail = error => ({
  type: GET_DISCOUNT_ERROR,
  error: error.message
});

export const getDiscount = () => dispatch => {
  console.log("discount duck: getDiscount");
  dispatch(getDiscountStart());
  return axios
    .get("/api/users/discount")
    .then(response => {
      if (!response.data.success) {
        throw new Error(response.data.error);
      } else {
        dispatch(getDiscountSuccess(response.data));
        return response.data;
      }
    })
    .catch(error => {
      dispatch(getDiscountFail(error));
    });
};

const SET_DISCOUNT_SUCCESS = `${prefix}/SET_DISCOUNT_SUCCESS`;

export const setDiscountSuccess = data => ({
  type: SET_DISCOUNT_SUCCESS,
  discount: data.discount,
  fetchedAt: Date.now()
});

export const setDiscount = ({ discount }) => dispatch => {
  // console.log('balance duck: setBalance: ', balance);
  return axios
    .post("/api/users/discount", {
      discount
    })
    .then(response => {
      if (!response.data.success) {
        throw new Error(response.data.error);
      } else {
        dispatch(setDiscountSuccess(response.data));
        return response.data;
      }
    })
    .catch(error => {
      throw new SubmissionError({ _error: error.response.data.error });
    });
};

const initialState = Immutable({
  value: 0,
  discountIsLoading: false,
  discountError: "",
  fetchedAt: 0
});

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_DISCOUNT_START:
      return Immutable.merge(state, {
        discountIsLoading: true,
        discountError: ""
      });
    case GET_DISCOUNT_SUCCESS:
      return Immutable.merge(state, {
        discountIsLoading: false,
        discountError: "",
        value: action.discount,
        fetchedAt: action.fetchedAt
      });
    case GET_DISCOUNT_ERROR:
      return Immutable.merge(state, {
        discountIsLoading: false,
        discountError: action.error
      });

    case SET_DISCOUNT_SUCCESS:
      return Immutable.merge(state, {
        value: action.discount,
        fetchedAt: action.fetchedAt
      });
    default:
      return state;
  }
}
