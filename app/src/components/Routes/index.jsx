import React from "react";
import { Route, Switch } from "react-router-dom";
import Event from "../../containers/Event";
import NotFound from "../NotFound";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Event} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
