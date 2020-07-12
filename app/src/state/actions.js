export const setEvents = events => ({ type: 'SET_EVENTS', events });

export const addEvent = event => ({ type: 'ADD_EVENT', event });

export const clearEventFields = () => ({ type: 'CLEAR_EVENT_FIELDS' });

export const setRounds = rounds => ({ type: 'SET_ROUNDS', rounds });

export const addRound = round => ({ type: 'ADD_ROUND', round });

export const clearRoundFields = () => ({ type: 'CLEAR_ROUND_FIELDS' });
