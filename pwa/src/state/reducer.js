export const reducer = (state, action) => {
  switch (action.type) {
    case 'CLICK_INSTALL':
      return {
        ...state,
        isInstalable: false,
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
