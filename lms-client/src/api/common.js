import axiosInstance from './axiosConfig';

// === 📩 Contact ===

export const submitContactForm = async (formData) => {
  try {
    const response = await axiosInstance.post('/contact', formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const getContactData = async () => {
  try {
    const response = await axiosInstance.get('/contact');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact data:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

// === 🎓 Courses ===

export const fetchCourses = async () => {
  try {
    const res = await axiosInstance.get('/admin/courses');
    return Array.isArray(res.data) ? res.data : res.data.courses || [];
  } catch (error) {
    console.error('fetchCourses error:', error);
    throw error;
  }
};

export const getCourses = () => axiosInstance.get('/courses/all');

// === 🎥 Videos ===

export const uploadVideo = async (formData) => {
  const res = await axiosInstance.post('/addvideo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getAllVideos = async () => {
  const res = await axiosInstance.get('/videos');
  return res.data;
};

export const deleteVideo = async (videoId) => {
  const res = await axiosInstance.delete(`/videos/${videoId}`);
  return res.data;
};

export const updateVideo = async (videoId, formData) => {
  const res = await axiosInstance.put(`/videos/${videoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// === 🧑‍🎓 Students ===

export const getAllStudents = async () => {
  const token = localStorage.getItem('token');
  return axiosInstance.get('/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateStudent = (id, updateData) => {
  return axiosInstance.put(`/users/${id}`, updateData);
};

export const deleteStudent = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete student:', error);
    throw error;
  }
};

// === 📊 Dashboard ===

export const getDashboardStats = async () => {
  const response = await axiosInstance.get('/dashboard-stats');
  return response.data;
};

// === 📚 Enrollments ===

export const getAllEnrollments = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get('/enrollments', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch enrollments';
  }
};

// === 🎯 Progress Tracking ===

export const getAllCourseStudents = () => axiosInstance.get('/course-progress/all');
export const getCourseStudents = (courseId) => axiosInstance.get(`/course-progress/${courseId}`);
export const getFullStudentProgress = (courseId, studentId) =>
  axiosInstance.get(`/progress/full/${courseId}/${studentId}`);
export const createCourseCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/course-category', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error adding course category:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};
export const getAllCourseCategories = async () => {
  try {
    const response = await axiosInstance.get('/course-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching course categories:', error);
    throw error.response?.data || { message: 'Failed to fetch course categories' };
  }
};

export const updateCourseCategory = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/course-categories/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating course category:', error);
    throw error.response?.data || { message: 'Failed to update category' };
  }
};

//lms
export const deleteCourseCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/course-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course category:', error);
    throw error.response?.data || { message: 'Failed to delete category' };
  }
};

// Add instructor
export const addInstructor = async (instructorData) => {
    try {
        const res = await axiosInstance.post(`/add-instructor`, instructorData);
        return res.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: 'Network error' };
    }
};

// Get all instructors
export const getInstructors = async () => {
    try {
        const response = await axiosInstance.get(`/instructors`);
        return response.data;
    } catch (error) {
        console.error("Error fetching instructors:", error);
        throw error;
    }
};

// Update Instructor
export const updateInstructor = async (id, updatedData) => {
    const response = await axiosInstance.put(`/instructors/${id}`, updatedData);
    return response.data;
};

// Delete Instructor
export const deleteInstructor = async (id) => {
    const response = await axiosInstance.delete(`/instructors/${id}`);
    return response.data;
};
