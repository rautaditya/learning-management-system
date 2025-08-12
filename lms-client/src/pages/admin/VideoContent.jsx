// import { useState } from 'react';
// import { Search, Upload, Edit2, Trash2, Filter, MoreVertical, Play, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// export default function VideoContentManagement() {
//   // Sample video data
//   const [videos, setVideos] = useState([
//     { 
//       id: 1, 
//       title: 'Introduction to React', 
//       duration: '10:25', 
//       uploadDate: '2025-04-28', 
//       status: 'published',
//       views: 342,
//       category: 'Development',
//       thumbnail: '/api/placeholder/320/180'
//     },
//     { 
//       id: 2, 
//       title: 'Advanced CSS Techniques', 
//       duration: '15:40', 
//       uploadDate: '2025-04-25', 
//       status: 'published',
//       views: 187,
//       category: 'Design',
//       thumbnail: '/api/placeholder/320/180'
//     },
//     { 
//       id: 3, 
//       title: 'Database Design Fundamentals', 
//       duration: '22:15', 
//       uploadDate: '2025-05-01', 
//       status: 'processing',
//       views: 0,
//       category: 'Database',
//       thumbnail: '/api/placeholder/320/180'
//     },
//     { 
//       id: 4, 
//       title: 'User Experience Principles', 
//       duration: '18:30', 
//       uploadDate: '2025-04-20', 
//       status: 'draft',
//       views: 0,
//       category: 'Design',
//       thumbnail: '/api/placeholder/320/180'
//     },
//     { 
//       id: 5, 
//       title: 'JavaScript for Beginners', 
//       duration: '25:10', 
//       uploadDate: '2025-04-15', 
//       status: 'published',
//       views: 543,
//       category: 'Development',
//       thumbnail: '/api/placeholder/320/180'
//     }
//   ]);

//   // Filter and search state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('All');
//   const [filterStatus, setFilterStatus] = useState('All');
  
//   // Modal states
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   // New video form state
//   const [newVideo, setNewVideo] = useState({
//     title: '',
//     category: '',
//     description: ''
//   });

//   // Filter videos based on search and filters
//   const filteredVideos = videos.filter(video => {
//     const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = filterCategory === 'All' || video.category === filterCategory;
//     const matchesStatus = filterStatus === 'All' || video.status === filterStatus;
    
//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   // Total statistics
//   const totalVideos = videos.length;
//   const publishedVideos = videos.filter(v => v.status === 'published').length;
//   const totalViews = videos.reduce((sum, video) => sum + video.views, 0);

//   // Status badge component
//   const StatusBadge = ({ status }) => {
//     if (status === 'published') {
//       return (
//         <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded text-xs font-medium">
//           <CheckCircle className="w-3 h-3 mr-1" /> Published
//         </span>
//       );
//     } else if (status === 'processing') {
//       return (
//         <span className="flex items-center text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs font-medium">
//           <Clock className="w-3 h-3 mr-1" /> Processing
//         </span>
//       );
//     } else {
//       return (
//         <span className="flex items-center text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-medium">
//           <AlertCircle className="w-3 h-3 mr-1" /> Draft
//         </span>
//       );
//     }
//   };

//   // Handle upload form submit
//   const handleUpload = (e) => {
//     e.preventDefault();
    
//     // Create new video object
//     const video = {
//       id: videos.length + 1,
//       title: newVideo.title,
//       category: newVideo.category,
//       duration: '00:00', // Would be extracted from actual video file
//       uploadDate: new Date().toISOString().split('T')[0],
//       status: 'processing',
//       views: 0,
//       thumbnail: '/api/placeholder/320/180'
//     };
    
//     // Add to videos list
//     setVideos([...videos, video]);
    
//     // Reset form and close modal
//     setNewVideo({ title: '', category: '', description: '' });
//     setShowUploadModal(false);
//   };

//   // Handle delete confirmation
//   const confirmDelete = () => {
//     if (selectedVideo) {
//       setVideos(videos.filter(v => v.id !== selectedVideo.id));
//       setShowDeleteModal(false);
//       setSelectedVideo(null);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <h1 className="text-2xl font-bold text-gray-900">Video Content Management</h1>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {/* Stats cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <Play className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <h2 className="text-sm font-medium text-gray-500">Total Videos</h2>
//                 <p className="text-2xl font-semibold text-gray-900">{totalVideos}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="bg-green-100 p-3 rounded-full">
//                 <CheckCircle className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <h2 className="text-sm font-medium text-gray-500">Published Videos</h2>
//                 <p className="text-2xl font-semibold text-gray-900">{publishedVideos}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="bg-purple-100 p-3 rounded-full">
//                 <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                 </svg>
//               </div>
//               <div className="ml-4">
//                 <h2 className="text-sm font-medium text-gray-500">Total Views</h2>
//                 <p className="text-2xl font-semibold text-gray-900">{totalViews}</p>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Controls and filters */}
//         <div className="bg-white rounded-lg shadow mb-6">
//           <div className="px-4 py-5 sm:p-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
//               <div className="flex items-center space-x-4">
//                 <div className="relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
//                     placeholder="Search videos..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </div>
                
//                 <div className="relative inline-block text-left">
//                   <select
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                     value={filterCategory}
//                     onChange={(e) => setFilterCategory(e.target.value)}
//                   >
//                     <option value="All">All Categories</option>
//                     <option value="Development">Development</option>
//                     <option value="Design">Design</option>
//                     <option value="Database">Database</option>
//                     <option value="Marketing">Marketing</option>
//                   </select>
//                 </div>
                
//                 <div className="relative inline-block text-left">
//                   <select
//                     className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                   >
//                     <option value="All">All Status</option>
//                     <option value="published">Published</option>
//                     <option value="processing">Processing</option>
//                     <option value="draft">Draft</option>
//                   </select>
//                 </div>
//               </div>
              
//               <button
//                 type="button"
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 onClick={() => setShowUploadModal(true)}
//               >
//                 <Upload className="h-4 w-4 mr-2" />
//                 Upload Video
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Video grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//           {filteredVideos.map((video) => (
//             <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="relative">
//                 <img 
//                   src={video.thumbnail} 
//                   alt={video.title} 
//                   className="w-full h-40 object-cover"
//                 />
//                 <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
//                   {video.duration}
//                 </div>
//               </div>
              
//               <div className="p-4">
//                 <div className="flex justify-between items-start">
//                   <h3 className="text-lg font-medium text-gray-900 truncate">{video.title}</h3>
//                   <div className="relative">
//                     <button className="text-gray-400 hover:text-gray-600">
//                       <MoreVertical className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="mt-2 flex items-center justify-between">
//                   <div>
//                     <StatusBadge status={video.status} />
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     {video.uploadDate}
//                   </div>
//                 </div>
                
//                 <div className="mt-4 flex items-center justify-between">
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                     {video.category}
//                   </span>
//                   <div className="text-sm text-gray-500 flex items-center">
//                     <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                     {video.views}
//                   </div>
//                 </div>
                
//                 <div className="mt-4 flex justify-between">
//                   <button 
//                     className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     <Edit2 className="h-3 w-3 mr-1" />
//                     Edit
//                   </button>
                  
//                   <button 
//                     className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     onClick={() => {
//                       setSelectedVideo(video);
//                       setShowDeleteModal(true);
//                     }}
//                   >
//                     <Trash2 className="h-3 w-3 mr-1" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         {/* No results message */}
//         {filteredVideos.length === 0 && (
//           <div className="text-center py-12">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//             </svg>
//             <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
//             <p className="mt-1 text-sm text-gray-500">
//               Try changing your search or filter criteria.
//             </p>
//           </div>
//         )}
//       </div>
      
//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed z-10 inset-0 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
            
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <form onSubmit={handleUpload}>
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="sm:flex sm:items-start">
//                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
//                       <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
//                         Upload New Video
//                       </h3>
//                       <div className="mt-6 space-y-6">
//                         <div>
//                           <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                             Video Title
//                           </label>
//                           <input
//                             type="text"
//                             name="title"
//                             id="title"
//                             className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                             value={newVideo.title}
//                             onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
//                             required
//                           />
//                         </div>
                        
//                         <div>
//                           <label htmlFor="category" className="block text-sm font-medium text-gray-700">
//                             Category
//                           </label>
//                           <select
//                             id="category"
//                             name="category"
//                             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                             value={newVideo.category}
//                             onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
//                             required
//                           >
//                             <option value="">Select a category</option>
//                             <option value="Development">Development</option>
//                             <option value="Design">Design</option>
//                             <option value="Database">Database</option>
//                             <option value="Marketing">Marketing</option>
//                           </select>
//                         </div>
                        
//                         <div>
//                           <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                             Description
//                           </label>
//                           <textarea
//                             id="description"
//                             name="description"
//                             rows={3}
//                             className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//                             value={newVideo.description}
//                             onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
//                           ></textarea>
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">
//                             Video File
//                           </label>
//                           <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                             <div className="space-y-1 text-center">
//                               <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
//                                 <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
//                               </svg>
//                               <div className="flex text-sm text-gray-600">
//                                 <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
//                                   <span>Upload a file</span>
//                                   <input id="file-upload" name="file-upload" type="file" className="sr-only" />
//                                 </label>
//                                 <p className="pl-1">or drag and drop</p>
//                               </div>
//                               <p className="text-xs text-gray-500">
//                                 MP4, WebM or MOV up to 500MB
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="submit"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Upload
//                   </button>
//                   <button
//                     type="button"
//                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                     onClick={() => setShowUploadModal(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && selectedVideo && (
//         <div className="fixed z-10 inset-0 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
            
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                     <AlertCircle className="h-6 w-6 text-red-600" />
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
//                       Delete Video
//                     </h3>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500">
//                         Are you sure you want to delete the video "{selectedVideo.title}"? This action cannot be undone.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 <button
//                   type="button"
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={confirmDelete}
//                 >
//                   Delete
//                 </button>
//                 <button
//                   type="button"
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   onClick={() => {
//                     setShowDeleteModal(false);
//                     setSelectedVideo(null);
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// } 

// import React, { useState, useEffect } from 'react';
// import { addVideo } from '../../api/common';
// import axios from 'axios';

// export default function VideoContent() {
//   const [videos, setVideos] = useState([]);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [duration, setDuration] = useState('');
//   const [courseId, setCourseId] = useState('');
//   const [videoFile, setVideoFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [courses, setCourses] = useState([]);

//   // Fetch courses on mount
// useEffect(() => {
//   const fetchCourses = async () => {
//     try {
//       const res = await axios.get('/admin/courses');
//       console.log('Fetched courses raw:', res.data);

//       // Try multiple ways in case the data structure is nested
//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data.courses || [];

//       console.log('Courses after parsing:', data);
//       setCourses(data);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       alert('Failed to load courses');
//     }
//   };
//   fetchCourses();
// }, []);



//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title || !videoFile || !courseId) {
//       alert('All fields including course are required');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('duration', duration);
//     formData.append('course', courseId); // should match backend field name
//     formData.append('uploadvideo', videoFile);

//     setUploading(true);
//     try {
//       const result = await addVideo(formData);
//       setVideos([result, ...videos]); // assuming API returns created video
//       setTitle('');
//       setDescription('');
//       setDuration('');
//       setVideoFile(null);
//       setCourseId('');
//     } catch (err) {
//       console.error('Upload error:', err);
//       alert('Failed to upload video');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>

//       <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow space-y-4">
//         <input
//           type="text"
//           className="w-full p-2 border"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           required
//         />
//         <textarea
//           className="w-full p-2 border"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Description"
//         />
//         <input
//           type="text"
//           className="w-full p-2 border"
//           value={duration}
//           onChange={(e) => setDuration(e.target.value)}
//           placeholder="Duration (e.g. 5:30)"
//         />

//        <select
//   className="w-full p-2 border"
//   value={courseId}
//   onChange={(e) => setCourseId(e.target.value)}
//   required
// >
//   <option value="">Select Course</option>
//   {courses.map((course) => (
//     <option key={course._id} value={course._id}>
//       {course.title}
//     </option>
//   ))}
// </select>


//         <input
//           type="file"
//           className="w-full"
//           accept="video/*"
//           onChange={(e) => setVideoFile(e.target.files[0])}
//           required
//         />

//         <button
//           type="submit"
//           disabled={uploading}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {uploading ? 'Uploading...' : 'Add Video'}
//         </button>
//       </form>
//     </div>
//   );
// }
  import React, { useState, useEffect } from 'react';
import { fetchCourses, uploadVideo, getAllVideos, deleteVideo, updateVideo } from '../../api/common';

const VideoContent = () => {
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);

  // Form state (for add/edit)
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    description: '',
    duration: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewURL, setVideoPreviewURL] = useState(null);

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);

  // Preview play toggle
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const courseList = await fetchCourses();
        setCourses(courseList);

        const videoList = await getAllVideos();
        setVideos(videoList);
      } catch (err) {
        alert('Error loading data');
      }
    }
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({ course: '', title: '', description: '', duration: '' });
    setVideoFile(null);
    setVideoPreviewURL(null);
    setShowPlayer(false);
    setIsEditing(false);
    setEditingVideoId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreviewURL(url);
      setShowPlayer(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course || !formData.title || (!videoFile && !isEditing)) {
      return alert('Course, title, and video file (for new or changing video) are required');
    }

    const data = new FormData();
    data.append('course', formData.course);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('duration', formData.duration);
    if (videoFile) {
      data.append('uploadvideo', videoFile);
    }

    try {
      if (isEditing && editingVideoId) {
        await updateVideo(editingVideoId, data);
        alert('Video updated successfully');
      } else {
        await uploadVideo(data);
        alert('Video uploaded successfully');
      }
      resetForm();
      const updatedVideos = await getAllVideos();
      setVideos(updatedVideos);
    } catch (err) {
      alert(err.message || 'Server error');
    }
  };

  const handleEditClick = (video) => {
    setIsEditing(true);
    setEditingVideoId(video._id);
    setFormData({
      course: video.course?._id || '',
      title: video.title || '',
      description: video.description || '',
      duration: video.duration || ''
    });
    setVideoPreviewURL(video.videoPath || null);
    setVideoFile(null); // no new file selected yet
    setShowPlayer(false);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id);
        alert('Video deleted');
        const updatedVideos = await getAllVideos();
        setVideos(updatedVideos);
      } catch (err) {
        alert('Failed to delete video');
      }
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Video Content' : 'Upload Video Content'}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-3">
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
          className="w-full border p-2"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>{course.title}</option>
          ))}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <textarea
          name="description"
          placeholder="Video Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2"
        ></textarea>

        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. 5:00)"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full"
          // required if not editing (upload new video)
          required={!isEditing}
        />

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isEditing ? 'Update Video' : 'Upload Video'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Preview Section */}
      {videoPreviewURL && (
        <div className="mt-6 relative">
          {!showPlayer ? (
            <div className="relative group">
              <video
                src={videoPreviewURL}
                className="w-full rounded shadow"
                muted
                preload="metadata"
              />
              <button
                onClick={() => setShowPlayer(true)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-4xl rounded"
                type="button"
              >
                ▶
              </button>
            </div>
          ) : (
            <video
              src={videoPreviewURL}
              className="w-full rounded shadow"
              controls
              autoPlay
            />
          )}
        </div>
      )}

      {/* List of Videos */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Existing Videos</h3>
        {videos.length === 0 && <p>No videos uploaded yet.</p>}
        <ul className="space-y-4">
          {videos.map((video) => (
            <li key={video._id} className="border p-3 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{video.title}</p>
                <p className="text-sm text-gray-600">{video.course?.title || 'No course'}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(video)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  type="button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(video._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoContent;
