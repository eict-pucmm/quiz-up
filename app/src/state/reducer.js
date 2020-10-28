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

    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: Object.assign({}, state.questions, { ...action.questions }),
      };

    case 'ADD_QUESTION':
      return {
        ...state,
        questionToAdd: Object.assign({}, state.questionToAdd, {
          ...action.question,
        }),
      };

    case 'CLEAR_QUESTION_FORM':
      return { ...state, questionToAdd: initialState.questionToAdd };

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
