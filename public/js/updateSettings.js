import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:5000/api/v1/users/updateMyPassword'
        : 'http://localhost:5000/api/v1/users/updateMe';

    const res = await axios.patch(url, data);

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`, 5);
    }
  } catch (err) {
    showAlert('error', err.response.data.message, 5);
  }
};
