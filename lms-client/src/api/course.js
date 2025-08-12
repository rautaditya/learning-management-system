// api/course.js
import axiosInstance from './axiosConfig';

export const addCourse = async (courseData) => {
  const role = localStorage.getItem('admin_role');

  const endpoint = role === 'superadmin'
    ? '/superadmin/courses'
    : '/admin/courses';

  const response = await axiosInstance.post(endpoint, courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
