export const initialState = {
  viewOldEvents: false,
  events: {
    data: [],
    saving: false,
    openModal: false,
  },
  eventToAdd: {
    name: '',
    dateOfEvent: new Date(),
  },
  round: {
    event: '',
    selectedRound: 0,
    saving: false,
  },
  roundToAdd: {
    name: '',
    categories: [],
    teams: [],
  },
  questions: {
    data: [],
    allCategories: [],
    saving: false,
    editing: false,
    //nameChanged is needed to prevent a 409 error when updating a question
    nameChanged: false,
  },
  questionToAdd: {
    name: '',
    categories: [],
    points: 100,
    errorName: false,
    errorCategories: false,
    errorPoints: false,
  },
};
