import { initialState } from './initialState';

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return {
        ...state,
        events: Object.assign({}, state.events, { ...action.events }),
      };

    case 'ADD_EVENT':
      return {
        ...state,
        eventToAdd: Object.assign({}, state.eventToAdd, { ...action.event }),
      };

    case 'CLEAR_EVENT_FIELDS':
      return { ...state, eventToAdd: initialState.eventToAdd };

    default:
      return state;
  }
};
