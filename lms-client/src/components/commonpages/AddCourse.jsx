import React, { useState, useEffect } from 'react';
import {
  Check,
  AlertTriangle,
  X,
  Upload,
  BookOpen,
  Clock,
  Award,
  Globe,
  FileText,
  Users,
  DollarSign,
  Tag,
  Plus
} from 'lucide-react';
import { addCourse } from '../../api/course';
import { getAllCourseCategories, createCourseCategory } from '../../api/common';

export default function AddCourse() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    courseImage: null,
    priceType: 'Free',
    price: 0,
    instructor: '',
    duration: '',
    level: 'Beginner',
    syllabus: '',
    prerequisites: '',
    language: 'English',
    certification: 'No',
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [previewImage, setPreviewImage] = useState(null);

  // Modal states for adding category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    setCategoryError(null);
    try {
      const data = await getAllCourseCategories();
      setCategories(data);
    } catch (error) {
      setCategoryError('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'courseImage' && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setFormData((prev) => ({
        ...prev,
        courseImage: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value || 0) : value,
      }));
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      await addCourse(data);
      showNotification('success', 'Course added successfully!');

      // reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        courseImage: null,
        priceType: 'Free',
        price: 0,
        instructor: '',
        duration: '',
        level: 'Beginner',
        syllabus: '',
        prerequisites: '',
        language: 'English',
        certification: 'No',
      });
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      showNotification('error', 'Error adding course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      showNotification('error', 'Category name is required');
      return;
    }
    setAddingCategory(true);
    try {
      await createCourseCategory({ title: newCategory.trim() });
      showNotification('success', 'Category added successfully!');
      setNewCategory('');
      setShowCategoryModal(false);
      await fetchCategories(); // Refresh dropdown
    } catch (error) {
      console.error(error);
      showNotification('error', 'Error adding category');
    } finally {
      setAddingCategory(false);
    }
  };

  const FormSections = {
    basic: (
      <>
        {/* Title */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title<span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={formData.title}
            placeholder="Enter course title"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
            <span className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-blue-500" />
              Category<span className="text-red-500">*</span>
            </span>
          </label>

          {loadingCategories ? (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500 text-sm">{categoryError}</p>
          ) : (
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                if (e.target.value === '__add_new__') {
                  setShowCategoryModal(true);
                  // Reset category selection to avoid selecting the "add new" option
                  setFormData((prev) => ({ ...prev, category: '' }));
                } else {
                  setFormData((prev) => ({ ...prev, category: e.target.value }));
                }
              }}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>
                -- Select a category --
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
              <option value="__add_new__" className="font-semibold text-blue-600">
                + Add New Category
              </option>
            </select>
          )}
        </div>

        {/* Instructor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            Instructor
          </label>
          <input
            name="instructor"
            value={formData.instructor}
            placeholder="Instructor name"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-blue-500" />
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            placeholder="Describe what students will learn"
            onChange={handleChange}
            required
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Upload className="w-4 h-4 mr-2 text-blue-500" />
            Cover Image
          </label>
          <div className="flex items-center space-x-4">
            <div
              className={`w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 ${
                previewImage ? 'border-blue-300' : 'border-gray-300'
              }`}
            >
              <input
                id="courseImage"
                name="courseImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <label htmlFor="courseImage" className="cursor-pointer">
                {previewImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewImage}
                      alt="Course preview"
                      className="h-32 object-cover rounded mb-2"
                    />
                    <span className="text-sm text-blue-600">Change image</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Click to upload course image
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </>
    ),
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full">
      {/* Notifications */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-green-100 border-l-4 border-green-500'
              : 'bg-red-100 border-l-4 border-red-500'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          )}
          <p>{notification.message}</p>
          <button
            onClick={() => setNotification({ show: false })}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <input
              type="text"
              placeholder="Category title"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={addingCategory}
                className={`px-4 py-2 text-white rounded-lg ${
                  addingCategory ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {addingCategory ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 p-8 rounded-b-3xl shadow-md">
        <h1 className="text-3xl font-bold text-white">Create a New Course</h1>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto p-6 mt-6 bg-white rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FormSections[activeSection]}
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                isSubmitting
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
