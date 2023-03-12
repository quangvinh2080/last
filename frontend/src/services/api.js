import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosWithCredentials = axios.create({
  withCredentials: true,
});

export const info = () => {
  const token = Cookies.get('token');
  const URL = `${API_URL}/users/me`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const login = async ({ email, password }) => {
  const URL = `${API_URL}/users/login`;

  return axiosWithCredentials.post(URL, {
    email,
    password,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const register = ({ email, password }) => {
  const URL = `${API_URL}/users/register`;

  return axiosWithCredentials.post(URL, {
    email,
    password,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
