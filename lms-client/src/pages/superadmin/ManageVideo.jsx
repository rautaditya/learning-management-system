import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import { getallVideos } from '../../api/superadmin';
import { getallCourses } from '../../api/superadmin';


const AddVideo = () => {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [form, setForm] = useState({ title: '', url: '', course: '', description: '', duration: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  useEffect(() => {
    fetchVideos();
    loadCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterCourse, videos]);

 const fetchVideos = async () => {
  try {
    const data = await getallVideos();
    console.log('Fetched videos:', data); // 👈 Add this line
    setVideos(data);
  } catch (err) {
    console.error('Failed to fetch videos', err);
    alert('Could not load videos');
  }
};


  const loadCourses = async () => {
    try {
      const data = await getallCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
      alert('Could not load courses');
    }
  };

  const applyFilters = () => {
    let result = [...videos];
    if (searchTerm.trim()) {
      result = result.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterCourse) {
      result = result.filter(video => video.course && video.course._id === filterCourse);
    }
    setFilteredVideos(result);
  };

  const confirmDelete = (video) => {
    setVideoToDelete(video);
  };

  const handleDeleteConfirmed = async () => {
    if (videoToDelete) {
      try {
        await axios.delete(`superadmin/getallvideos/${videoToDelete._id}`);
        await fetchVideos();
        setVideoToDelete(null);
      } catch (error) {
        console.error('Delete failed', error);
        alert('Failed to delete video');
      }
    }
  };

  const cancelDelete = () => {
    setVideoToDelete(null);
  };

  const openEditModal = (video) => {
    setEditingVideo(video._id);
    setForm({
      title: video.title || '',
      url: '',
      course: video.course?._id || '',
      description: video.description || '',
      duration: video.duration || ''
    });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('duration', form.duration);
      formData.append('course', form.course);

      if (form.url) {
        formData.append('uploadvideo', form.url);
      }

      await axios.put(`superadmin/getallvideos/${editingVideo}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchVideos();
      setEditingVideo(null);
      setForm({ title: '', url: '', course: '', description: '', duration: '' });
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update video');
    }
  };

  const cancelEdit = () => {
    setEditingVideo(null);
    setForm({ title: '', url: '', course: '', description: '', duration: '' });
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold mb-4">Add Videos</h2>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        >
          <option value="">Filter by Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.title}</option>
          ))}
        </select>
      </div>

      {/* Video Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div key={video._id} className="border p-4 rounded-lg shadow-md bg-white relative">
            <video controls className="w-full mb-3">
              <source src={`http://localhost:5000/${video.videoPath}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h3 className="text-xl font-semibold mb-1">{video.title}</h3>
            <p className="text-gray-700 text-sm mb-1"><strong>Description:</strong> {video.description || 'N/A'}</p>
            <p className="text-gray-700 text-sm mb-2"><strong>Duration:</strong> {video.duration || 'N/A'}</p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Course:</strong> {video.course?.title || 'N/A'}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => openEditModal(video)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => confirmDelete(video)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Video</h3>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 5:30)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            />
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="border p-2 rounded w-full mb-3"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setForm({ ...form, url: e.target.files[0] })}
              className="border p-2 rounded w-full mb-3"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {videoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this video?</h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddVideo;
