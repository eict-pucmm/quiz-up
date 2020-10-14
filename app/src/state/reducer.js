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

    case 'SET_ROUND_ATTRIBUTES':
      return {
        ...state,
        round: Object.assign({}, state.round, { ...action.round }),
      };

    case 'ADD_ROUND':
      return {
        ...state,
        roundToAdd: Object.assign({}, state.roundToAdd, { ...action.round }),
      };

    case 'CLEAR_EVENT_FIELDS':
      return { ...state, eventToAdd: initialState.eventToAdd };

    case 'CLEAR_ROUND_FIELDS':
      return { ...state, roundToAdd: initialState.roundToAdd };

    case 'VIEW_OLD_EVENTS':
      return { ...state, viewOldEvents: action.status };

    default:
      return state;
  }
};
