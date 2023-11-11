import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:5000/api/v1/users/login', {
      email,
      password,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully', 5);
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 5);
  }
};
export const logoutClient = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/v1/users/logout');
    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 5);
  }
};
