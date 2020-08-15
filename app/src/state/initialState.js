export const initialState = {
  test: 'test',
  events: {
    data: [],
    saving: false,
    openModal: false,
  },
  eventToAdd: {
    name: '',
    dateOfEvent: new Date(),
  },
  rounds: {
    data: [],
    event: '',
    openInfoModal: false,
    addRound: false,
    selectedRound: 0,
    saving: false,
  },
  roundToAdd: {
    name: '',
  },
};
