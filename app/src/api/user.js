export const getUser = () => {
  return localStorage.getItem('USER');
};

export const setUser = user => {
  localStorage.setItem('USER', user);
};

export const removeUser = () => {
  localStorage.removeItem('USER');
};
