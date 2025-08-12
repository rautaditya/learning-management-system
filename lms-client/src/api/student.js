// import API from './axiosConfig';
// import axios from './axiosConfig';

// export const checkStudentEmail = (email) => API.post('/student/check-email', { email });
// export const sendOtp = (email) => API.post('/student/send-otp', { email });
// export const verifyOtp = (email, otp) => API.post('/student/verify-otp', { email, otp });
// export const signupStudent = (data) => API.post('/student/signup', data);



// export const getApprovedCourses = async () => {
//   try {
//     const res = await API.get('/student/courses');
//     return res.data;
//   } catch (err) {
//     console.error('Error fetching approved courses', err);
//     return [];
//   }
// };

// // export const getCourseById = async (id) => {
// //   try {
// //     const res = await API.get(`/student/courses/${id}`);
// //     return res.data;
// //   } catch (err) {
// //     console.error('Error fetching course details by ID:', err);
// //     return null;
// //   }
// // };

// export const fetchProfile = async (token) => {
//   const res = await axios.get('/student/profile', {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return res.data;
// };

// // src/api/student.js

// export const getMyLearning = async () => {
//   const res = await API.get('/student/my-learning');
//   return res.data;
// };
// export const getCourseById = async (id) => {
//   const res = await API.get(`/student/course/${id}`);
//   return res.data;
// };
// export const getAvailableExams = async () => {
//   const res = await axiosInstance.get('/student/available-exams');
//   return res.data;
// };
// export const getEnrolledExams = async (studentId) => {
//   try {
//     const res = await API.get(`/student/enrolled-exams/${studentId}`);
//     return res.data.exams || [];
//   } catch (err) {
//     console.error('Error fetching enrolled exams:', err);
//     return [];
//   }
// };

// // ✅ New: Check if exam is submitted
// export const checkExamSubmission = async (examId) => {
//   try {
//     const res = await API.get(`/exam/check-submission/${examId}`);
//     return res.data.submitted;
//   } catch (err) {
//     console.error(`Error checking submission for exam ${examId}:`, err);
//     return false;
//   }
// };


// // // ✅ Assignments (your main request)
// // export const getAssignmentsByEnrollmentId = async (enrollmentId) => {
// //   try {
// //     const res = await API.get(`/student/assignments/${enrollmentId}`);
// //     return res.data;
// //   } catch (err) {
// //     console.error('Error fetching assignments', err);
// //     return [];
// //   }
// // };

// // export const getAssignmentsByEnrollmentId = async (enrollmentId) => {
// //   return API.get(`/student/assignments/${enrollmentId}`);
// // };


// // export const getAssignmentsByEnrollmentId = async (id) => {
// //   return API.get(`/student/assignments/${id}`);
// // };



// // api/student.js
// export const getMyAssignments = async () => {
//   try {
//     const response = await axios.get('/student/assignments');
//     return response.data.assignments;
//   } catch (error) {
//     console.error('Error fetching assignments:', error);
//     throw error.response?.data || { msg: 'Unknown error occurred' };
//   }
// };
// export const getStudentStudyMaterials = () =>
//   API.get('/study-materials/student');
// export const getCourseProgress = (courseId) => {
//   return API.get(`/progress/${courseId}`);
// };

import axiosInstance from './axiosConfig';
import axios from "axios";

// ✅ Student Auth APIs
export const checkStudentEmail = (email) => axiosInstance.post('/student/check-email', { email });
export const sendOtp = (email) => axiosInstance.post('/student/send-otp', { email });
export const verifyOtp = (email, otp) => axiosInstance.post('/student/verify-otp', { email, otp });
export const signupStudent = (data) => axiosInstance.post('/student/signup', data);

// ✅ Courses
export const getApprovedCourses = async () => {
  try {
    const res = await axiosInstance.get('/student/courses');
    return res.data;
  } catch (err) {
    console.error('Error fetching approved courses', err);
    return [];
  }
};

export const getCourseById = async (id) => {
  const res = await axiosInstance.get(`/student/course/${id}`);
  return res.data;
};

export const getCourseProgress = (courseId) => {
  return axiosInstance.get(`/progress/${courseId}`); // ✅ API instead of axios or fetch
};

// ✅ Exams
export const getAvailableExams = async () => {
  const res = await axiosInstance.get('/student/available-exams');
  return res.data;
};

export const getEnrolledExams = async (studentId) => {
  try {
    const res = await axiosInstance.get(`/student/enrolled-exams/${studentId}`);
    return res.data.exams || [];
  } catch (err) {
    console.error('Error fetching enrolled exams:', err);
    return [];
  }
};

export const checkExamSubmission = async (examId) => {
  try {
    const res = await axiosInstance.get(`/exam/check-submission/${examId}`);
    return res.data.submitted;
  } catch (err) {
    console.error(`Error checking submission for exam ${examId}:`, err);
    return false;
  }
};

// ✅ Learning & Assignments
export const getMyLearning = async () => {
  const res = await axiosInstance.get('/student/my-learning');
  return res.data;
};

export const getMyAssignments = async () => {
  try {
    const response = await axiosInstance.get('/student/assignments');
    return response.data.assignments;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error.response?.data || { msg: 'Unknown error occurred' };
  }
};

// ✅ Study Materials
export const getStudentStudyMaterials = () =>
  axiosInstance.get('/study-materials/student');

// ✅ Profile
export const getUserProfile = async () => {
  const res = await axiosInstance.get('/student/profile');
  return res.data;
};
// ✅ Track Video Completion
// src/api/student.js
export const markVideoCompleted = async (courseId, videoId) => {
  try {
    const res = await axiosInstance.post('/progress/track-video', { courseId, videoId });
    console.log('markVideoCompleted → backend response:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ markVideoCompleted error:', error.response?.data || error.message);
    throw error;
  }
};
export const markExamCompleted = async (courseId, examId) => {
    const response = await axiosInstance.post('/progress/track-exam', { courseId, examId });
    return response; // Axios response object
  API.get('/study-materials/student');
};

export const updateStudentProfile = async (id, updatedData) => {
  try {
    const isFormData = updatedData instanceof FormData;

    const res = await axiosInstance.put(
      `/student/profile/${id}`,
      updatedData,
      {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json"
        }
      }
    );

    return res.data; // contains message + updated user
  } catch (error) {
    console.error("Error updating student profile:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

