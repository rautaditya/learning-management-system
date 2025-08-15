import axiosInstance from './axiosConfig';
import axios from './axiosConfig';
/**
 * Add a new course (admin only)
 */
export const addCourse = async (courseData) => {
  const response = await axiosInstance.post('/admin/courses', courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};



export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axiosInstance.put(`/admin/courses/${courseId}`, courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// const BASE_URL = 'http://localhost:5000/api'; // change this as per your backend

export const deleteCourse = async (courseId, token) => {
  try {
    const res = await axios.delete(`/admin/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const createAssignment = async (formData) => {
  try {
    const response = await axios.post('/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating assignment' };
  }
};

export const getAllCourses = async () => {
  try {
    const res = await axiosInstance.get('/admin/courses'); // ✅ Backend route must match
    return res.data; // Should return an array of courses
  } catch (err) {
    console.error('Error fetching courses:', err);
    return [];
  }
};
export const getAllAssignments = async () => {
  const token = localStorage.getItem('token'); // or get it from context
  const response = await axios.get('/assignments', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateAssignment = async (id, formData) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`/assignments/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const deleteAssignment = async (id) => {
  const res = await axios.delete(`/assignments/${id}`);
  return res.data;
};



// Create Exam API
export const createExam = async (examData) => {
  try {
    const response = await axiosInstance.post('/admin/createexam', examData);
    return response.data; // returns { message, exam }
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error.response?.data || { message: 'Unknown error occurred' };
  }
};

// Get All Exams API
export const getAllExams = async () => {
  try {
    const response = await axiosInstance.get('/admin/exams');
    return response.data;
  } catch (error) {
    console.error('Error fetching exams:', error.response || error);
    throw error.response?.data || { message: 'Error fetching exams' };
  }
};

// Delete Exam
export const deleteExamById = async (examId) => {
  try {
    const response = await axiosInstance.delete(`/admin/exam/${examId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting exam:', error.response || error);
    throw error.response?.data || { message: 'Error deleting exam' };
  }
};

// Update Exam
// api/admin.js
export const updateExamById = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/admin/exam/${id}`, updatedData);
    return response.data; // Make sure your backend returns { exam: updatedExam }
  } catch (error) {
    console.error('Update Exam API Error:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Failed to update exam' };
  }
};

// api/admin.js

export const getUserProfile = async () => {
  const res = await axiosInstance.get('/admin/adminprofile', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
    }
  });
  return res.data;
};

export const fetchEnrolledCourses = async () => {
  const token = localStorage.getItem('token'); // Assuming you're storing it this way

  const res = await axios.get('/admin/enrolledcourses', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const updateAdminProfile = async (formData) => {
  const token = localStorage.getItem('admin_token');
  const res = await axios.put('/admin/adminprofile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Single course completion report
export const getCourseCompletionReport = async (courseId) => {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get(`/admin/completion/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getExamCompletionReport = async (examId) => {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get(`/admin/exam-completion/${examId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// get submissions
export const getAssignmentSubmissions = async (assignmentId) => {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get(`/admin/assignment/${assignmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};