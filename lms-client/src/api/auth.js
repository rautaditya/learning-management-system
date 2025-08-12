import axiosInstance from './axiosConfig';


export const adminSuperadminLogin = (credentials) => {
  return axiosInstance.post('/auth/admin-superadmin-login', credentials);
};
