import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosWithCredentials = axios.create({
  withCredentials: true,
});

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


export const addTask = ({ name, description, expected_days, latest_date }) => {
  const token = Cookies.get('token');
  const URL = `${API_URL}/tasks`;
  return axios.post(URL, {
    name,
    description,
    expected_days,
    latest_date,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateTask = (id, params) => {
  const token = Cookies.get('token');
  const URL = `${API_URL}/tasks/${id}`;
  return axios.patch(URL, params, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const deleteTask = (id) => {
  const token = Cookies.get('token');
  const URL = `${API_URL}/tasks/${id}`;
  return axios.delete(URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getGoogleSheetsIntegration = () => {
  const token = Cookies.get('token'); 
  const URL = `${API_URL}/googlesheets`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sharePermission = (email) => {
  const token = Cookies.get('token'); 
  const URL = `${API_URL}/googlesheets/share_permission`;
  return axios.post(URL, {
    email
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
