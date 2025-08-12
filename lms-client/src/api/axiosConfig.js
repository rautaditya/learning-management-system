import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Update as needed
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    let token = null;

    const studentRole = localStorage.getItem('student_role');
    const adminRole = localStorage.getItem('admin_role');

    if (adminRole === 'admin' || adminRole === 'superadmin') {
      token = localStorage.getItem('admin_token');
    } else if (studentRole === 'student') {
      token = localStorage.getItem('student_token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      const adminRole = localStorage.getItem('admin_role');
      const studentRole = localStorage.getItem('student_role');

      if (adminRole) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_role');
        localStorage.removeItem('admin_user');
        window.location.href = '/adminsuperadmin/login'; // or '/login'
      } else if (studentRole) {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_role');
        localStorage.removeItem('student_user');
        window.location.href = '/';
      } else {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
