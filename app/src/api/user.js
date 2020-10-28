const getUser = () => {
  return localStorage.getItem('USER');
};

const setUser = user => {
  localStorage.setItem('USER', user);
};

const removeUser = () => {
  localStorage.removeItem('USER');
};

export { getUser, setUser, removeUser };
