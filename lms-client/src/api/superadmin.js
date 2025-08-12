
import axiosInstance from './axiosConfig';
import axios from 'axios';



// ✅ Add Admin
export const addAdmin = async (formData, profileImage) => {
  const data = new FormData();
  for (let key in formData) {
    data.append(key, formData[key]);
  }
  if (profileImage) {
    data.append('profileImage', profileImage);
  }

  try {
    const res = await axiosInstance.post('/superadmin/add-admin', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    console.error('Error adding admin:', err);
    throw err;
  }
};

// ✅ Get All Admins
export const getAllAdmins = async () => {
  try {
    const res = await axiosInstance.get('/superadmin/getalladmins');
    return res.data;
  } catch (err) {
    console.error('Error fetching admins:', err);
    throw err;
  }
};

// ✅ Delete Admin
export const deleteAdmin = async (id) => {
  try {
    const res = await axiosInstance.delete(`/superadmin/delete-admin/${id}`);
    return res.data;
  } catch (err) {
    console.error('Error deleting admin:', err);
    throw err;
  }
};

// ✅ Update Admin (with optional image support)
export const updateAdmin = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/superadmin/update-admin/${id}`, data);
    return res.data;
  } catch (err) {
    console.error('Error updating admin:', err);
    throw err;
  }
};

// ✅ Get All Courses (including approved/unapproved)
export const getAllCourses = async () => {
  try {
    const res = await axiosInstance.get('/courses');
    return res.data;
  } catch (err) {
    console.error('Error fetching courses:', err);
    throw err;
  }
};

// ✅ Approve a course
export const approveCourse = async (courseId) => {
  try {
    const res = await axiosInstance.put(`/courses/${courseId}/approve`);
    return res.data;
  } catch (err) {
    console.error('Error approving course:', err);
    throw err;
  }
};

// ✅ Unapprove a course
export const unapproveCourse = async (courseId) => {
  try {
    const res = await axiosInstance.put(`/courses/${courseId}/unapprove`);
    return res.data;
  } catch (err) {
    console.error('Error unapproving course:', err);
    throw err;
  }
};

// ✅ Get All Courses (for superadmin)
export const getallCourses = async () => {
  try {
    const res = await axiosInstance.get('/superadmin/getallcourses');
    return res.data;
  } catch (err) {
    console.error('Error fetching all courses:', err);
    throw err;
  }
};

// ✅ Get course by ID
// export const getCourseById = async (id) => {
//   try {
//     const res = await axiosInstance.get(`/superadmin/course/${id}`);
//     return res.data;
//   } catch (err) {
//     console.error(`Error fetching course with id ${id}:`, err);
//     throw err;
//   }
// };

// ✅ Update course by ID
// api/superadmin.js
export const updateCourseById = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/superadmin/courses/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update API Error:', error.response?.data || error.message);
    throw error;
  }
};



// ✅ Delete course by ID
export const deleteCourseById = async (id) => {
  try {
    const res = await axiosInstance.delete(`/superadmin/course/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting course with id ${id}:`, err);
    throw err;
  }
};

export const getCourseById = async (id) => {
  
  try {
    const response = await axiosInstance.get(`/superadmin/course/${id}`);
  return response.data;
  } catch (err) {
    console.error(`Error fetching course with id ${id}:`, err);
    throw err;
  }
};

export const createAssignment = async (formData) => {
  try {
    const response = await axiosInstance.post('/superadmin/addassignment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating assignment' };
  }
};

export const getAllAssignments = async () => {
  return await axiosInstance.get('/superadmin/getassignments');
};

export const createAssignment2 = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }
    const response = await axios.post('/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } 
  catch (error) {
    throw error.response?.data || { message: 'Error creating assignment' };
  }
};
// export const updateAssignment = async (id, formData) => {
//   const token = localStorage.getItem('token');
//   const response = await axios.put(`/assignments/${id}`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// export const updateAssignment = (id, data) =>
//   axiosInstance.put(`/superadmin/update-assignment/${id}`, formdata);
export const updateAssignment = (id, data) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('dueDate', data.dueDate);
  if (data.file) {
    formData.append('file', data.file);
  }

  return axiosInstance.put(`/superadmin/update-assignment/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteAssignment = (id) => {
  return axiosInstance.delete(`/superadmin/delete-assignment/${id}`);
};

// ✅upload Videos
export const uploadVideo = async (formData) => {
  try {
    const response = await axiosInstance.post('/superadmin/uploadvideo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error uploading video' };
  }
};


export const getallVideos = async () => {
  try {
    const response = await axiosInstance.get('/superadmin/getallvideos');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching videos' };
  }
}
export const addCourse = async (courseData) => {
  const response = await axiosInstance.post('/superadmin/courses', courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteVideo = async (videoId) => {
  const res = await axios.delete(`api/superadmin/getallvideos/${videoId}`);
  return res.data;
};

//logic to update video
export const updateVideo = async (videoId, formData) => {
  const res = await axios.put(`/api/superadmin/getallvideos/${videoId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// export const getAllStudents = async () => {
//   const token = localStorage.getItem('token');
//   return await axiosInstance.get('/superadmin/users', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
// onst BASE_URL = 'http://localhost:5000/superadmin'; // Change if your base URL is different

// Update student status
export const updateStudent = (id, updateData) => {
  return axiosInstance.put(`/superadmin/users/${id}`, updateData);
};
export const deleteStudent = async (id) => {
  try {
    const response = await axiosInstance.delete(`/superadmin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete student:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  const res = await axiosInstance.get('/superadmin/superadminprofile', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
    }
  });
  return res.data;
};

export const updateSuperadminProfile = async (formData) => {
  const token = localStorage.getItem('admin_token');
  const res = await axiosInstance.put('/superadmin/superadminprofile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};