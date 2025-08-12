
// import React, { useEffect, useState } from 'react';
// import {
//   Search, Edit, Trash2, Info, Check, AlertTriangle, X, ChevronLeft, ChevronRight,
//   Filter, Plus, RefreshCw, BookOpen, Clock, User, DollarSign, Award
// } from 'lucide-react';
// import { getAllCourses } from '../../api/admin';

// export default function ManageCourse() {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({ category: '', priceType: '', level: '', status: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showFilters, setShowFilters] = useState(false);
//   const coursesPerPage = 6;

//   const [notification, setNotification] = useState({ show: false, type: '', message: '' });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [stats, setStats] = useState({ total: 0, active: 0, draft: 0, free: 0 });

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const data = await getAllCourses();
//         setCourses(data);
        
//         // Calculate stats
//         const active = data.filter(course => course.status === 'Active').length;
//         const free = data.filter(course => course.priceType === 'Free').length;
//         setStats({
//           total: data.length,
//           active,
//           draft: data.length - active,
//           free
//         });
        
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load courses');
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     let result = courses.filter(course =>
//       course.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (filters.category) result = result.filter(course => course.category === filters.category);
//     if (filters.priceType) result = result.filter(course => course.priceType === filters.priceType);
//     if (filters.level) result = result.filter(course => course.level === filters.level);
//     if (filters.status) result = result.filter(course => course.status === filters.status);

//     setFilteredCourses(result);
//     setCurrentPage(1);
//   }, [searchTerm, filters, courses]);

//   const categories = [...new Set(courses.map(course => course.category))];
//   const levels = [...new Set(courses.map(course => course.level))];
//   const statuses = [...new Set(courses.map(course => course.status))];

//   const indexOfLastCourse = currentPage * coursesPerPage;
//   const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
//   const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
//   const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setFilters({ category: '', priceType: '', level: '', status: '' });
//   };

//   const showNotification = (type, message) => {
//     setNotification({ show: true, type, message });
//     setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
//   };

//   const handleDelete = async (id) => {
//     try {
//       // In a real app, this would call your API
//       // await axios.delete(`/api/courses/${id}`);
//       setCourses(prev => prev.filter(course => course._id !== id));
//       showNotification('success', 'Course deleted successfully!');
//     } catch (err) {
//       showNotification('error', 'Failed to delete course.');
//     }
//   };

//   const confirmDelete = (id, title) => {
//     if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
//       handleDelete(id);
//     }
//   };

//   const getStatusBadgeColor = (status) => {
//     switch (status) {
//       case 'Active':
//         return 'bg-emerald-100 text-emerald-700 border-emerald-200';
//       case 'Draft':
//         return 'bg-amber-100 text-amber-700 border-amber-200';
//       case 'Archived':
//         return 'bg-gray-100 text-gray-700 border-gray-200';
//       default:
//         return 'bg-blue-100 text-blue-700 border-blue-200';
//     }
//   };

//   const getCourseDuration = () => {
//     const durations = ['3h 15m', '1h 30m', '4h 45m', '2h 20m', '5h 10m'];
//     return durations[Math.floor(Math.random() * durations.length)];
//   };

//   const getStudentCount = () => {
//     return Math.floor(Math.random() * 5000);
//   };

//   if (loading) {
//     return (
//       <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-xl font-medium text-gray-700">Loading courses...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen w-full">
//       {/* Notification */}
//       {notification.show && (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
//           notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
//         }`}>
//           <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
//             {notification.type === 'success' ? (
//               <Check className="w-5 h-5 text-green-600" />
//             ) : (
//               <AlertTriangle className="w-5 h-5 text-red-600" />
//             )}
//           </div>
//           <p className={`font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
//             {notification.message}
//           </p>
//           <button onClick={() => setNotification({ show: false, type: '', message: '' })} className="ml-auto text-gray-500 hover:text-gray-700">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//       )}

//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
//           <p className="text-blue-100 mb-6">View, edit and manage all your educational content</p>
          
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-md">
//               <div className="flex items-center">
//                 <div className="bg-blue-100 p-3 rounded-full mr-4">
//                   <BookOpen className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Total Courses</p>
//                   <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-md">
//               <div className="flex items-center">
//                 <div className="bg-emerald-100 p-3 rounded-full mr-4">
//                   <Check className="w-6 h-6 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Active Courses</p>
//                   <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-md">
//               <div className="flex items-center">
//                 <div className="bg-amber-100 p-3 rounded-full mr-4">
//                   <Clock className="w-6 h-6 text-amber-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Draft Courses</p>
//                   <p className="text-2xl font-bold text-gray-800">{stats.draft}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-md">
//               <div className="flex items-center">
//                 <div className="bg-purple-100 p-3 rounded-full mr-4">
//                   <DollarSign className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Free Courses</p>
//                   <p className="text-2xl font-bold text-gray-800">{stats.free}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Actions Bar */}
//       <div className="bg-white border-b shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
//           <div className="flex items-center gap-2 flex-grow max-w-md bg-gray-50 border rounded-lg px-3 py-2">
//             <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
//             <input
//               type="text"
//               placeholder="Search by course title..."
//               className="w-full outline-none bg-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             {searchTerm && (
//               <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-5 h-5" />
//               </button>
//             )}
//           </div>
          
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={() => setShowFilters(!showFilters)} 
//               className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
//             >
//               <Filter className="w-4 h-4" />
//               <span>Filters{filteredCourses.length !== courses.length ? ` (${filteredCourses.length})` : ''}</span>
//             </button>
            
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
//               <Plus className="w-5 h-5" />
//               <span>Add Course</span>
//             </button>
//           </div>
//         </div>
        
//         {/* Filter Panel */}
//         {showFilters && (
//           <div className="max-w-7xl mx-auto px-4 py-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//               <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white shadow-sm">
//                 <option value="">All Categories</option>
//                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
//               <select name="priceType" value={filters.priceType} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white shadow-sm">
//                 <option value="">All Prices</option>
//                 <option value="Free">Free</option>
//                 <option value="Paid">Paid</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
//               <select name="level" value={filters.level} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white shadow-sm">
//                 <option value="">All Levels</option>
//                 {levels.map(level => <option key={level} value={level}>{level}</option>)}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white shadow-sm">
//                 <option value="">All Statuses</option>
//                 {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
//               </select>
//             </div>
            
//             <div className="md:col-span-4 flex justify-end">
//               <button 
//                 onClick={resetFilters} 
//                 className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Course List */}
//       <div className="max-w-7xl mx-auto p-4 lg:p-6">
//         {error ? (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
//             <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
//             <p className="text-lg font-medium">{error}</p>
//             <button className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg">
//               Try Again
//             </button>
//           </div>
//         ) : filteredCourses.length === 0 ? (
//           <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
//             <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-bold text-gray-800 mb-2">No courses found</h3>
//             <p className="text-gray-500 max-w-md mx-auto mb-6">
//               We couldn't find any courses matching your search criteria. Try adjusting your filters or create a new course.
//             </p>
//             <div className="flex justify-center gap-4">
//               <button onClick={resetFilters} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
//                 Reset Filters
//               </button>
//               <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                 Add New Course
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
//             {currentCourses.map(course => (
//               <div key={course._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                 <div className="p-4 border-b border-gray-100 flex justify-between items-center">
//                   <div className="flex items-center">
//                     <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
//                       course.category === 'Development' ? 'bg-blue-100' :
//                       course.category === 'Business' ? 'bg-green-100' :
//                       course.category === 'Design' ? 'bg-purple-100' : 'bg-gray-100'
//                     }`}>
//                       <span className="text-lg font-bold">
//                         {course.title.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                     <div className="ml-3">
//                       <h2 className="font-semibold text-gray-800">{course.title}</h2>
//                       <div className="flex items-center text-gray-500 text-sm">
//                         <span className="mr-2">{course.category}</span>
//                         <span className="w-1 h-1 bg-gray-300 rounded-full mr-2"></span>
//                         <span>{course.level}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(course.status)}`}>
//                     {course.status}
//                   </span>
//                 </div>
                
//                 <div className="p-4">
//                   <div className="grid grid-cols-3 gap-2 mb-4">
//                     <div className="text-center p-2">
//                       <div className="flex justify-center">
//                         <User className="w-4 h-4 text-gray-400" />
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">Students</p>
//                       <p className="text-sm font-semibold">{getStudentCount().toLocaleString()}</p>
//                     </div>
                    
//                     <div className="text-center p-2">
//                       <div className="flex justify-center">
//                         <Clock className="w-4 h-4 text-gray-400" />
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">Duration</p>
//                       <p className="text-sm font-semibold">{course.duration || '3 months'}</p>
//                     </div>
                    
//                     <div className="text-center p-2">
//                       <div className="flex justify-center">
//                         {course.priceType === 'Free' ? (
//                           <Award className="w-4 h-4 text-gray-400" />
//                         ) : (
//                           <DollarSign className="w-4 h-4 text-gray-400" />
//                         )}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">Price</p>
//                       <p className="text-sm font-semibold">
//                         {course.priceType === 'Free' ? 'Free' : `$${course.price || '29.99'}`}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="flex justify-between">
//                     <div className="text-sm text-gray-500">
//                       Instructor: <span className="font-medium text-gray-700">{course.instructor || 'John Doe'}</span>
//                     </div>
                    
//                     <div className="flex gap-2">
//                       <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
//                         <Info className="w-4 h-4" />
//                       </button>
//                       <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"  >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button 
//                         onClick={() => confirmDelete(course._id, course.title)}
//                         className="p-1.5 text-red-600 hover:bg-red-50 rounded"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-8 mb-4">
//             <div className="inline-flex rounded-md shadow-sm">
//               <button 
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
//                 disabled={currentPage === 1} 
//                 className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
              
//               {[...Array(totalPages).keys()].map(page => (
//                 <button 
//                   key={page + 1} 
//                   onClick={() => setCurrentPage(page + 1)} 
//                   className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
//                     currentPage === page + 1 
//                       ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   {page + 1}
//                 </button>
//               ))}
              
//               <button 
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
//                 disabled={currentPage === totalPages} 
//                 className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         )}
        
//         <div className="text-center text-sm text-gray-500 mt-4">
//           Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
//         </div>
//       </div>
      
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Search, Edit, Trash2, Info, Check, AlertTriangle, X, ChevronLeft, ChevronRight,
  Filter, Plus, RefreshCw, BookOpen, Clock, User, DollarSign, Award, Save,FileText,ListChecks,FolderOpen,BarChart2,AlertCircle,Globe,Tag
} from 'lucide-react';
import { getAllCourses, updateCourse,deleteCourse } from '../../api/admin';


export default function ManageCourse() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', priceType: '', level: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const coursesPerPage = 6;

  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, draft: 0, free: 0 });

  // Edit course state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  //filetext

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    level: '',
    status: '',
    priceType: '',
    price: '',
    instructor: '',
    duration: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
        
        // Calculate stats
        const active = data.filter(course => course.status === 'Active').length;
        const free = data.filter(course => course.priceType === 'Free').length;
        setStats({
          total: data.length,
          active,
          draft: data.length - active,
          free
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.category) result = result.filter(course => course.category === filters.category);
    if (filters.priceType) result = result.filter(course => course.priceType === filters.priceType);
    if (filters.level) result = result.filter(course => course.level === filters.level);
    if (filters.status) result = result.filter(course => course.status === filters.status);

    setFilteredCourses(result);
    setCurrentPage(1);
  }, [searchTerm, filters, courses]);

  const categories = [...new Set(courses.map(course => course.category))];
  const levels = [...new Set(courses.map(course => course.level))];
  const statuses = [...new Set(courses.map(course => course.status))];

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
const coursestatuses = ['active', 'inactive', 'active']; // ← duplicate 'active'

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({ category: '', priceType: '', level: '', status: '' });
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
  };

  // const handleDelete = async (id) => {
  //   try {
  //     // In a real app, this would call your API
  //     // await axios.delete(`/api/courses/${id}`);
  //     setCourses(prev => prev.filter(course => course._id !== id));
  //     showNotification('success', 'Course deleted successfully!');
  //   } catch (err) {
  //     showNotification('error', 'Failed to delete course.');
  //   }
  // };
  const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Or from context/state
    await deleteCourse(id, token); // ✅ Actual API call
    setCourses(prev => prev.filter(course => course._id !== id)); // ✅ Update UI
    showNotification('success', 'Course deleted successfully!');
  } catch (err) {
    showNotification('error', err.message || 'Failed to delete course.');
  }
};


  const confirmDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      handleDelete(id);
    }
  };

  // Edit course functions
  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      category: course.category || '',
      level: course.level || '',
      status: course.status || '',
      priceType: course.priceType || '',
      price: course.price || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
description: course.description || '',
      syllabus: course.syllabus || '',
      prerequisites: course.prerequisites || '',
      language: course.language || '',
      certification: course.certification || ''

    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCourse(null);
  };

 const handleFormChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};


  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Call the API to update the course
      await updateCourse(editingCourse._id, formData);
      
      // Update the local state
      setCourses(prev => prev.map(course => 
        course._id === editingCourse._id ? { ...course, ...formData } : course
      ));
      
      closeEditModal();
      showNotification('success', 'Course updated successfully!');
    } catch (err) {
      showNotification('error', 'Failed to update course.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getCourseDuration = () => {
    const durations = ['3h 15m', '1h 30m', '4h 45m', '2h 20m', '5h 10m'];
    return durations[Math.floor(Math.random() * durations.length)];
  };

  const getStudentCount = () => {
    return Math.floor(Math.random() * 5000);
  };

  // Edit Modal Component
 // Edit Modal Component
  const EditCourseModal = () => {
    if (!isEditModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-90vh overflow-y-auto">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900">Edit Course</h3>
            <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleUpdateCourse} className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="col-span-2 space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                      Syllabus
                    </label>
                    <textarea
                      id="syllabus"
                      name="syllabus"
                      value={formData.syllabus}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <ListChecks className="w-4 h-4 mr-2 text-blue-500" />
                      Prerequisites
                    </label>
                    <textarea
                      id="prerequisites"
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <BarChart2 className="w-4 h-4 mr-2 text-blue-500" />
                      Level
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-blue-500" />
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {coursestatuses.map((stat, index) => (
  <option key={`${stat}-${index}`} value={stat}>{stat}</option>
))}

                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-blue-500" />
                      Language
                    </label>
                    <input
                      type="text"
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      Instructor
                    </label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      Duration
                    </label>
                    <input
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      placeholder="e.g. 8 weeks, 12 hours"
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priceType" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-blue-500" />
                      Price Type
                    </label>
                    <select
                      id="priceType"
                      name="priceType"
                      value={formData.priceType}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  
                  {formData.priceType === 'Paid' ? (
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleFormChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="certification" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-blue-500" />
                        Certification
                      </label>
                      <select
                        id="certification"
                        name="certification"
                        value={formData.certification}
                        onChange={handleFormChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )}
                </div>
                
                {formData.priceType === 'Paid' && (
                  <div>
                    <label htmlFor="certification" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Award className="w-4 h-4 mr-2 text-blue-500" />
                      Certification
                    </label>
                    <select
                      id="certification"
                      name="certification"
                      value={formData.certification}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading && !isEditModalOpen) {
    return (
      <div className="bg-gray-50 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-700">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      {/* Edit Course Modal */}
      <EditCourseModal />
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
        }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
            {notification.type === 'success' ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className={`font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {notification.message}
          </p>
          <button onClick={() => setNotification({ show: false, type: '', message: '' })} className="ml-auto text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
          <p className="text-blue-100 mb-6">View, edit and manage all your educational content</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Draft Courses</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.draft}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Free Courses</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.free}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-grow max-w-md bg-gray-50 border rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by course title..."
              className="w-full outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border ${showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters{filteredCourses.length !== courses.length ? ` (${filteredCourses.length})` : ''}</span>
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Course</span>
            </button>
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 py-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white shadow-sm">
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Type</label>
              <select name="priceType" value={filters.priceType} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white shadow-sm">
                <option value="">All Prices</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select name="level" value={filters.level} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white shadow-sm">
                <option value="">All Levels</option>
                {levels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 rounded-lg border bg-white shadow-sm">
                <option value="">All Statuses</option>
                {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
              </select>
            </div>
            
            <div className="md:col-span-4 flex justify-end">
              <button 
                onClick={resetFilters} 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Course List */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
            <p className="text-lg font-medium">{error}</p>
            <button className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg">
              Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any courses matching your search criteria. Try adjusting your filters or create a new course.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={resetFilters} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Reset Filters
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add New Course
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {currentCourses.map(course => (
              <div key={course._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      course.category === 'Development' ? 'bg-blue-100' :
                      course.category === 'Business' ? 'bg-green-100' :
                      course.category === 'Design' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <span className="text-lg font-bold">
                        {course.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <h2 className="font-semibold text-gray-800">
  <Link to={`/admin/Courses/${course._id}`} className="hover:underline hover:text-blue-600 transition">
    {course.title}
  </Link>
</h2>
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">{course.category}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full mr-2"></span>
                        <span>{course.level}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2">
                      <div className="flex justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Students</p>
                      <p className="text-sm font-semibold">{getStudentCount().toLocaleString()}</p>
                    </div>
                    
                    <div className="text-center p-2">
                      <div className="flex justify-center">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Duration</p>
                      <p className="text-sm font-semibold">{course.duration || getCourseDuration()}</p>
                    </div>
                    
                    <div className="text-center p-2">
                      <div className="flex justify-center">
                        {course.priceType === 'Free' ? (
                          <Award className="w-4 h-4 text-gray-400" />
                        ) : (
                          <DollarSign className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Price</p>
                      <p className="text-sm font-semibold">
                        {course.priceType === 'Free' ? 'Free' : `$${course.price || '29.99'}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      Instructor: <span className="font-medium text-gray-700">{course.instructor || 'John Doe'}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                        <Info className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openEditModal(course)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(course._id, course.title)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1} 
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {[...Array(totalPages).keys()].map(page => (
                <button 
                  key={page + 1} 
                  onClick={() => setCurrentPage(page + 1)} 
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === page + 1 
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages} 
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-500 mt-4">
          Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
        </div>
      </div>
      
    </div>
  ) 
};

