export const setEvents = events => ({ type: 'SET_EVENTS', events });

export const addEvent = event => ({ type: 'ADD_EVENT', event });

export const clearEventFields = () => ({ type: 'CLEAR_EVENT_FIELDS' });

export const setRoundAttributes = attributes => ({
  type: 'SET_ROUND_ATTRIBUTES',
  round: attributes,
});

export const addRound = round => ({ type: 'ADD_ROUND', round });

export const clearRoundFields = () => ({ type: 'CLEAR_ROUND_FIELDS' });

export const viewOldEvents = status => ({ type: 'VIEW_OLD_EVENTS', status });
