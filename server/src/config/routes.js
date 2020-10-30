import questions from '../rest/components/question/routes';
import categories from '../rest/components/category/routes';
import residents from '../rest/components/resident/routes';
import teams from '../rest/components/team/routes';
import events from '../rest/components/event/routes';
import rounds from '../rest/components/round/routes';
import medicalCenters from '../rest/components/medicalCenter/routes';

// import authMiddleware from '../rest/middlewares/firebase-auth';

import {
  URL_QUESTIONS,
  URL_CATEGORIES,
  URL_RESIDENTS,
  URL_TEAMS,
  URL_EVENTS,
  URL_ROUNDS,
  URL_MEDICAL_CENTERS,
} from './urls';

const setRoutes = app => {
  //TODO: get credentials to see if it starts verifying the token correctly
  // app.use(authMiddleware); //use middleware for all routes
  app.use(URL_QUESTIONS, questions);
  app.use(URL_CATEGORIES, categories);
  app.use(URL_RESIDENTS, residents);
  app.use(URL_TEAMS, teams);
  app.use(URL_ROUNDS, rounds);
  app.use(URL_EVENTS, events);
  app.use(URL_MEDICAL_CENTERS, medicalCenters);
};

export default setRoutes;
