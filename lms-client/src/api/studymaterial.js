import axiosInstance from './axiosConfig';

export const uploadStudyMaterial = (formData) =>
  axiosInstance.post('/study-material', formData);

export const getAdminStudyMaterials = () =>
  axiosInstance.get('/study-materials/admin');

export const getAllStudyMaterials = () =>
  axiosInstance.get('/study-materials');

export const deleteStudyMaterial = (id) =>
  axiosInstance.delete(`/study-material/${id}`);
export const getStudyMaterials = async () => {
  const token = localStorage.getItem('admin_token');

  const res = await axiosInstance.get('/study-materials', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const updateStudyMaterial = (id, formData) =>
  axiosInstance.put(`/study-material/${id}`, formData);
