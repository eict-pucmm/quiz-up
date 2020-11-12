export const reducer = (state, action) => {
  switch (action.type) {
    case 'CLICK_INSTALL':
      return {
        ...state,
        isInstalable: false,
      };
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: Object.assign({}, state.currentUser, { ...action.user }),
      };
    case 'USER_INFO':
      return {
        ...state,
        userInfo: Object.assign({}, state.userInfo, { ...action.userInfo }),
      };
    default:
      return state;
  }
};
