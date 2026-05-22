import axiosInstance from '../utils/axiosInstance';

export const authAPI = {
  signup: async (name, email, password, confirmPassword) => {
    const response = await axiosInstance.post('/auth/signup', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data.data;
  },

  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data.data.admin;
  },

  updateProfile: async (name, email) => {
    const response = await axiosInstance.put('/auth/profile', {
      name,
      email,
    });
    return response.data.data.admin;
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await axiosInstance.put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
