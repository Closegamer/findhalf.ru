import { combineReducers } from "redux";
import { reducer as form } from "redux-form";
import balance from "./balance";
import auth from "./auth";
import games from "./games";
import users from "./users";
import admin from "./admin";
import playground from "./playground";
import discount from "./discount";

export default combineReducers({
  auth,
  balance,
  form,
  games,
  users,
  admin,
  playground,
  discount
});
