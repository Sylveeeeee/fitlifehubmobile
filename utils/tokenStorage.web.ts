const TOKEN_KEY = 'access_token';

export const storeToken = async (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  localStorage.removeItem(TOKEN_KEY);
};
