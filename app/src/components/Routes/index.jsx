import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Categories from '../../containers/Categories';
import Residents from '../../containers/Residents';
import Event from '../../containers/Event';
import Game from '../../containers/Game';
import Teams from '../../containers/Teams';
import NotFound from '../NotFound';
import Questions from '../../containers/Questions';
import Login from '../../containers/Login';
import Admin from '../../containers/Admins';
import MedicalCenters from '../../containers/MedicalCenters';

import { getUser } from '../../api/user.js';

const Routes = () => (
  <Switch>
    <Route path="/login" component={Login} />
    {!getUser() && <Redirect to="/login" />}
    <Route exact path="/" component={Event} />
    <Route path="/categories" component={Categories} />
    <Route path="/questions" component={Questions} />
    <Route path="/residents" component={Residents} />
    <Route path="/teams" component={Teams} />
    <Route path="/admins" component={Admin} />
    <Route path="/medical-centers" component={MedicalCenters} />
    <Route
      path="/event/round/:idOfRound"
      render={props => <Game {...props} />}
    />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;
