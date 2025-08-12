
// import React, { useState, useEffect } from 'react';
// import { uploadVideo } from '../../api/superadmin';
// import { getallCourses } from '../../api/superadmin';

// const AddVideo = () => {
//   const [courses, setCourses] = useState([]);
//   const [formData, setFormData] = useState({
//     course: '',
//     title: '',
//     description: '',
//     duration: ''
//   });
//   const [videoFile, setVideoFile] = useState(null);

//   useEffect(() => {
//     const loadCourses = async () => {
//       try {
//         const data = await getallCourses();
//         setCourses(data);
//       } catch (err) {
//         console.error('Failed to fetch courses', err);
//         alert('Could not load courses');
//       }
//     };
//     loadCourses();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setVideoFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.course || !formData.title || !videoFile) {
//       return alert('Course, title, and video are required');
//     }

//     const data = new FormData();
//     data.append('course', formData.course);
//     data.append('title', formData.title);
//     data.append('description', formData.description);
//     data.append('duration', formData.duration);
//     data.append('uploadvideo', videoFile);

//     try {
//       await uploadVideo(data);
//       alert('Video uploaded successfully');
//       setFormData({ course: '', title: '', description: '', duration: '' });
//       setVideoFile(null);
//     } catch (err) {
//       console.error('Upload error:', err);
//       alert(err?.response?.data?.message || 'Server error');
//     }
//   };
//   return (
//     <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Upload SUPERADMIN Video Content</h2>
//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
//           <select
//             name="course"
//             value={formData.course}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded-lg"
//           >
//             <option value="">Select Course</option>
//             {courses.map((course) => (
//               <option key={course._id} value={course._id}>{course.title}</option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             placeholder="Enter video title"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={4}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             placeholder="Enter video description"
//           ></textarea>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
//           <input
//             type="text"
//             name="duration"
//             value={formData.duration}
//             onChange={handleChange}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             placeholder="e.g. 5:00"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video File</label>
//           <input
//             type="file"
//             accept="video/*"
//             onChange={handleFileChange}
//             className="block w-full"
//             required
//           />
//         </div>

//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Upload Video
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };
    
// export default AddVideo;








import React, { useState, useEffect } from 'react';
import { Upload, Video, FileText, Clock, BookOpen, Sparkles, AlertCircle } from 'lucide-react';
import { uploadVideo } from '../../api/superadmin';
import { getallCourses } from '../../api/superadmin';

const AddVideo = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    description: '',
    duration: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getallCourses();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
        setError('Could not load courses');
      }
    };
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setError('');
      } else {
        setError('Please select a valid video file');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course || !formData.title || !videoFile) {
      setError('Course, title, and video are required');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('course', formData.course);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('duration', formData.duration);
    data.append('uploadvideo', videoFile);

    try {
      await uploadVideo(data);
      setSuccess('Video uploaded successfully!');
      setFormData({ course: '', title: '', description: '', duration: '' });
      setVideoFile(null);
      
      // Auto hide success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err?.response?.data?.message || 'Server error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Upload Video Content
          </h1>
          <p className="text-gray-600 text-lg">Share your knowledge with the world</p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-6">
            
            {/* Course Selection */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                Select Course
              </label>
              <div className="relative">
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-300"
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Video Title */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Video className="w-4 h-4 mr-2 text-indigo-500" />
                Video Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-gray-300"
                placeholder="Give your video an engaging title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 resize-none hover:border-gray-300"
                placeholder="Describe what viewers will learn from this video..."
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 hover:border-gray-300"
                placeholder="e.g., 5:30 or 10 minutes"
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Upload className="w-4 h-4 mr-2 text-indigo-500" />
                Upload Video File
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : videoFile 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('video-upload').click()}
              >
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                
                {videoFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Video className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-green-700 font-medium">{videoFile.name}</p>
                    <p className="text-green-600 text-sm">{formatFileSize(videoFile.size)}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-400 text-sm">MP4, MOV, AVI up to 500MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUploading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 hover:shadow-lg active:scale-95'
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Upload Video</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Make sure your video content follows our community guidelines
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddVideo;