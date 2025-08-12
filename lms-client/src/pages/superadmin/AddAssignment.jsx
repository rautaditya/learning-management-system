

import React, { useState, useEffect } from 'react';
import { createAssignment, getallCourses } from '../../api/superadmin';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Upload, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Plus,
  AlertCircle,
  X
} from 'lucide-react';

const AddAssignment = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    description: '',
    dueDate: '',
  });
  const [file, setFile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const courseList = await getallCourses();
        setCourses(courseList);
      } catch (error) {
        showPopup('error', error.message || 'Failed to load courses');
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => {
      setPopup({ show: false, type: '', message: '' });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('course', formData.course);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('dueDate', formData.dueDate);
    if (file) data.append('file', file);

    try {
      await createAssignment(data);
      showPopup('success', 'Assignment created successfully! 🎉');
      setFormData({ course: '', title: '', description: '', dueDate: '' });
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      showPopup('error', error.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setPopup({ show: false, type: '', message: '' });
  };

  const navigateToAssignments = () => {
    navigate('/superadmin/manageassignment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Popup Notifications */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div className={`
            max-w-md w-full rounded-xl shadow-2xl transform transition-all duration-300 ease-out
            ${popup.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : popup.type === 'error'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
            }
            animate-bounce
          `}>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {popup.type === 'success' ? (
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                ) : popup.type === 'error' ? (
                  <XCircle className="h-6 w-6 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-6 w-6 flex-shrink-0" />
                )}
                <p className="font-medium text-sm sm:text-base">{popup.message}</p>
              </div>
              <button 
                onClick={closePopup}
                className="ml-4 text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={navigateToAssignments}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-xl shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Assignments
              </button>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Create New Assignment
              </h1>
              <p className="text-gray-600 mt-1">Add assignments for your courses</p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Assignment Details</h2>
                <p className="text-blue-100 text-sm">Fill in the information below</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Course Selection */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                Select Course
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                disabled={coursesLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {coursesLoading ? 'Loading courses...' : 'Choose a course...'}
                </option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Title */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                Assignment Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter assignment title..."
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                Description
              </label>
              <textarea
                name="description"
                placeholder="Provide detailed instructions for the assignment..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                required
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                required
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Upload className="h-4 w-4 mr-2 text-blue-500" />
                Attachment (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {file && (
                  <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                    Selected: {file.name}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`
                  w-full px-6 py-4 rounded-xl font-medium text-white transition-all duration-200 
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-[1.02]'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Creating Assignment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create Assignment</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Tips for Creating Assignments</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Provide clear and detailed instructions in the description</li>
                <li>• Set realistic due dates to give students adequate time</li>
                <li>• Upload reference materials or templates when needed</li>
                <li>• Double-check all information before submitting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssignment;