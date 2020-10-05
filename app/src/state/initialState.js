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
};
