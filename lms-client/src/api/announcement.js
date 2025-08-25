import axiosInstance from "./axiosConfig"; // make sure you already have axiosInstance configured

// Send announcement
export const sendAnnouncement = async (data) => {
  try {
    const res = await axiosInstance.post("/announcement/send", data);
    return res.data;
  } catch (err) {
    console.error("Error sending announcement:", err);
    throw err;
  }
};

// Get announcements for a specific user
// export const getMyAnnouncements = async (userId) => {
//   try {
//     const res = await axiosInstance.get(`/announcement/user/${userId}`);
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching announcements:", err);
//     throw err;
//   }
// };
export const getMyAnnouncements = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await axiosInstance.get(`/announcement/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Get all courses (for student target dropdown)
export const getAllCourses = async () => {
  try {
    const res = await axiosInstance.get("/announcement/courses");
    return Array.isArray(res.data) ? res.data : res.data.courses || [];
    // return res.data;
  } catch (err) {
    console.error("Error fetching courses:", err);
    throw err;
  }
};

// export const fetchCourses = async () => {
//   try {
//     const res = await axiosInstance.get('/annnouncement/courses');
//     return Array.isArray(res.data) ? res.data : res.data.courses || [];
//   } catch (error) {
//     console.error('fetchCourses error:', error);
//     throw error;
//   }
// };

// Get all admins
export const getAllAdmins = async () => {
  try {
    const res = await axiosInstance.get("/announcement/getalladmins");
    return res.data;
  } catch (err) {
    console.error("Error fetching admins:", err);
    throw err;
  }
};

// Get all superadmins
export const getAllSuperAdmins = async () => {
  try {
    const res = await axiosInstance.get("/announcement/getallsuperadmins");
    return res.data;
  } catch (err) {
    console.error("Error fetching superadmins:", err);
    throw err;
  }
};

// Get all students
export const getAllStudents = async () => {
  try {
    const res = await axiosInstance.get("/announcement/getallstudents");
    return res.data;
  } catch (err) {
    console.error("Error fetching students:", err);
    throw err;
  }
};
export const getCourseAnnouncementsForStudent = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.get(
      `/announcement/user/${userId}/course-announcements`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching course announcements:", err);
    throw err;
  }
};