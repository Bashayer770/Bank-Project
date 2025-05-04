const BASE_URL =
  'https://react-bank-project.eapi.joincoded.com/mini-project/api';

export const API = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
  },
  PROFILE: {
    ME: `${BASE_URL}/auth/me`,
    ALLUSERS: `${BASE_URL}/auth/users`,
    UPDATEUSER: `${BASE_URL}/auth/profile`,
    USERINFO: `${BASE_URL}/auth/user`,
  },
};
