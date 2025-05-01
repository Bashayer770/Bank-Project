const BASE_URL =
  'https://react-bank-project.eapi.joincoded.com/mini-project/api';

export const API = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,    
    },
    TRANSACTIONS: {
      MY: `${BASE_URL}/transactions/my`,
      DEPOSIT: `${BASE_URL}/transactions/deposit`,
      WITHDRAW: `${BASE_URL}/transactions/withdraw`,
      TRANSFER: `${BASE_URL}/transactions/transfer/`,  
    }
};
