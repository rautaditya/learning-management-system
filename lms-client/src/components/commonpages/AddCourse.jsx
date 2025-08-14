import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { addCourse } from "../../api/course";
import { getAllCourseCategories } from "../../api/common";
import { createCourseCategory } from "../../api/common"; // your given API function

export default function AddCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    courseImage: null,
    priceType: "Free",
    price: 0,
    instructor: "",
    duration: "",
    level: "Beginner",
    syllabus: "",
    prerequisites: "",
    language: "English",
    certification: "No",
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [previewImage, setPreviewImage] = useState(null);

  // modal for adding category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    setCategoryError(null);
    try {
      const data = await getAllCourseCategories();
      setCategories(data);
    } catch (error) {
      setCategoryError("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "courseImage" && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setFormData((prev) => ({
        ...prev,
        courseImage: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value || 0) : value,
      }));
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
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
      showNotification("success", "Course added successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        courseImage: null,
        priceType: "Free",
        price: 0,
        instructor: "",
        duration: "",
        level: "Beginner",
        syllabus: "",
        prerequisites: "",
        language: "English",
        certification: "No",
      });
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      showNotification("error", "Error adding course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const result = await createCourseCategory({ title: newCategoryName });
      showNotification("success", "Category added successfully!");
      setCategories((prev) => [...prev, result]);
      setFormData((prev) => ({ ...prev, category: result.title }));
      setNewCategoryName("");
      setShowCategoryModal(false);
    } catch (error) {
      console.error(error);
      showNotification("error", error.message || "Failed to add category");
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
            id="title"
            name="title"
            value={formData.title}
            placeholder="Enter course title"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category with Add option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Tag className="w-4 h-4 mr-2 text-blue-500" />
            Category<span className="text-red-500">*</span>
          </label>
          {loadingCategories ? (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500 text-sm">{categoryError}</p>
          ) : (
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => {
                if (e.target.value === "__add_new__") {
                  setShowCategoryModal(true);
                } else {
                  handleChange(e);
                }
              }}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Select a category --
              </option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id || cat.title} value={cat.title}>
                  {cat.title}
                </option>
              ))}
              <option value="__add_new__">+ Add new category</option>
            </select>
          )}
        </div>

        {/* Instructor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-500" /> Instructor
          </label>
          <input
            name="instructor"
            value={formData.instructor}
            placeholder="Instructor name"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Image upload */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Upload className="w-4 h-4 mr-2 text-blue-500" /> Cover Image
          </label>
          <div className="flex items-center space-x-4">
            <div
              className={`w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 ${
                previewImage ? "border-blue-300" : "border-gray-300"
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
                    <span className="text-xs text-gray-400 mt-1">
                      Recommended: 1280x720px
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </>
    ),

    details: (
      <>
        {/* Price Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
            Price Type
          </label>
          <select
            id="priceType"
            name="priceType"
            value={formData.priceType}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Price (conditional) */}
        {formData.priceType === "Paid" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
              Price (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              placeholder="Enter price"
              min="0"
              step="0.01"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            Duration
          </label>
          <input
            id="duration"
            name="duration"
            value={formData.duration}
            placeholder="e.g. 8 weeks, 12 hours"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
            Level
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Globe className="w-4 h-4 mr-2 text-blue-500" />
            Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Certification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Award className="w-4 h-4 mr-2 text-blue-500" />
            Certification
          </label>
          <select
            id="certification"
            name="certification"
            value={formData.certification}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </>
    ),

    content: (
      <>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prerequisites
          </label>
          <textarea
            id="prerequisites"
            name="prerequisites"
            value={formData.prerequisites}
            placeholder="Any required knowledge or skills"
            required
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            List any knowledge or skills that students should have before
            taking this course
          </p>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Syllabus
          </label>
          <textarea
            id="syllabus"
            name="syllabus"
            value={formData.syllabus}
            placeholder="Course content structure"
            required
            onChange={handleChange}
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Outline the modules, lessons, and topics covered in your course
          </p>
        </div>
      </>
    ),
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-green-100 border-l-4 border-green-500"
              : "bg-red-100 border-l-4 border-red-500"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              notification.type === "success" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p
            className={`font-medium ${
              notification.type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {notification.message}
          </p>
          <button
            onClick={() =>
              setNotification({ show: false, type: "", message: "" })
            }
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={addingCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {addingCategory ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 p-8 rounded-b-3xl shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Create a New Course</h1>
          <p className="text-blue-100 mt-2">
            Share your knowledge with the world and inspire learners
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto p-6 mt-6">
        {/* Progress Tabs */}
        <div className="flex mb-8 border-b">
          <button
            onClick={() => setActiveSection("basic")}
            className={`pb-3 px-6 text-sm font-medium border-b-2 ${
              activeSection === "basic"
                ? "border-blue-500 text-blue-600"
                : "border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
            }`}
          >
            Basic Information
          </button>
          <button
            onClick={() => setActiveSection("details")}
            className={`pb-3 px-6 text-sm font-medium border-b-2 ${
              activeSection === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
            }`}
          >
            Course Details
          </button>
          <button
            onClick={() => setActiveSection("content")}
            className={`pb-3 px-6 text-sm font-medium border-b-2 ${
              activeSection === "content"
                ? "border-blue-500 text-blue-600"
                : "border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
            }`}
          >
            Course Content
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            onSubmit={handleSubmit}
          >
            {FormSections[activeSection]}

            <div className="col-span-2 flex justify-between mt-8">
              {activeSection !== "basic" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveSection(
                      activeSection === "content" ? "details" : "basic"
                    )
                  }
                  className="px-6 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              <div
                className={`flex justify-${
                  activeSection === "basic" ? "end" : "between"
                } ml-auto`}
              >
                {activeSection !== "content" ? (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        activeSection === "basic" ? "details" : "content"
                      )
                    }
                    className="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg text-white flex items-center gap-2 ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? "Publishing Course..." : "Publish Course"}
                    {isSubmitting && (
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 
                          0 0 5.373 0 12h4zm2 5.291A7.962 
                          7.962 0 014 12H0c0 3.042 1.135 
                          5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Tips for a Great Course
          </h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-start">
              <Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
              Use a clear, descriptive title that tells students exactly what
              they'll learn
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
              Upload a high-quality, engaging cover image related to your course
              content
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
              Break your syllabus into digestible sections with clear learning
              outcomes
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
              Be specific about prerequisites so students know if the course is
              right for them
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
