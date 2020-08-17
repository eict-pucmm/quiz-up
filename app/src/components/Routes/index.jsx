import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Categories from '../../containers/Categories';
import Residents from '../../containers/Residents';
import Event from '../../containers/Event';
import Game from '../../containers/Game';
import NotFound from '../NotFound';
import Questions from '../../containers/Questions';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Event} />
    <Route path="/categories" component={Categories} />
    <Route path="/questions" component={Questions} />
    <Route path="/residents" component={Residents} />
    <Route
      path="/event/round/:idOfRound"
      render={props => <Game {...props} />}
    />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
