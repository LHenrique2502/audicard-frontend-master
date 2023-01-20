export const TOKEN_KEY = "@token";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = token => {
  localStorage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.clear();
};

export const saveLogin = (user, pass) => {
  localStorage.setItem('user', user);
  localStorage.setItem('pass', pass);
}

export const saveLocal = (name, value) => {
  localStorage.setItem(name, value);
}

export const getSaveLocal = (name) => {
  return localStorage.getItem(name);
}
