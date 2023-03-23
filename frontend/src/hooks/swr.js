import useSWR from 'swr';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const fetcher = (url) => {
  const token = Cookies.get('token');
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => res.data)
}

export const useUser = () => {
  return useSWR(`${API_URL}/api/users/me`, fetcher, {
    onErrorRetry: (error) => {
      if (error.status >= 400) return;
    }
  });
};

export const useTasks = () => {
  return useSWR(`${API_URL}/api/tasks`, fetcher, {
    onErrorRetry: (error) => {
      if (error.status >= 400) return;
    }
  });
};
