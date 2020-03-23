import React from "react";
import { Route, Switch } from "react-router-dom";
import Event from "../../containers/Event";
import NotFound from "../NotFound";
import Game from "../../containers/Game";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Event} />
      <Route
        path="/event/round/:idOfRound"
        render={props => <Game {...props} />}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
