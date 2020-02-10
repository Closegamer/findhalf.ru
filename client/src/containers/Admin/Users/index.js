import React from "react";
import { Switch, Route } from "react-router-dom";
import List from "./List";

export default function Users({ match }) {
  return (
    <Switch>
      <Route path={`${match.path}/`} component={List} />
      {/* <Route path={`${match.path}/`} component={List} /> */}
      {/* <Route path={`${match.path}/create`} component={Edit} />
      <Route path={`${match.path}/create/:code`} component={Edit} /> */}
    </Switch>
  );
}
