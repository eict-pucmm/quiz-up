export const reducer = (state, action) => {
  switch (action.type) {
    case 'CLICK_INSTALL':
      return {
        ...state,
        isInstalable: false,
      };
    default:
      return state;
  }
};
