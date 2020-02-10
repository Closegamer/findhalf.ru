import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, user, ...rest }) => {
  console.log(user);
  // console.log(user);
  // console.log(isLoggedIn);
  return (
    <Route
      {...rest}
      render={props =>
        user !== "SuperAdmin" ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default PrivateRoute;
