export const getUser = () => {
  return localStorage.getItem('USER');
};

export const getUserInfo = () => {
  return {
    email: localStorage.getItem('email'),
    id: localStorage.getItem('id'),
  };
};

export const setUser = (user, email, id) => {
  localStorage.setItem('USER', user);
  if (email && id) {
    localStorage.setItem('email', email);
    localStorage.setItem('id', id);
  }
};

export const removeUser = () => {
  localStorage.removeItem('USER');
  localStorage.removeItem('email');
  localStorage.removeItem('id');
};
