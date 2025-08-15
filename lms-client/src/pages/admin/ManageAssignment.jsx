// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   getAllAssignments,
//   updateAssignment,
//   deleteAssignment,
// } from '../../api/admin';

// const ManageAssignment = () => {
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

//   const [assignments, setAssignments] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: '',
//     description: '',
//     dueDate: '',
//     file: null,
//     existingFileUrl: '',
//   });
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadAssignments();
//   }, []);

//   const loadAssignments = async () => {
//     try {
//       const data = await getAllAssignments();
//       setAssignments(data || []);
//     } catch (err) {
//       console.error('Error loading assignments:', err);
//       setMessage('Failed to load assignments');
//     }
//   };

//   const startEditing = (assignment) => {
//     setEditingId(assignment._id);
//     setEditForm({
//       title: assignment.title,
//       description: assignment.description,
//       dueDate: assignment.dueDate?.split('T')[0] || '',
//       file: null,
//       existingFileUrl: assignment.fileUrl || '',
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'file') {
//       setEditForm({ ...editForm, file: files[0] });
//     } else {
//       setEditForm({ ...editForm, [name]: value });
//     }
//   };

//   const saveEdit = async (id) => {
//     try {
//       const formData = new FormData();
//       formData.append('title', editForm.title);
//       formData.append('description', editForm.description);
//       formData.append('dueDate', editForm.dueDate);
//       if (editForm.file) {
//         formData.append('file', editForm.file);
//       }

//       await updateAssignment(id, formData);
//       setEditingId(null);
//       setMessage('Assignment updated successfully');
//       loadAssignments();
//     } catch (err) {
//       console.error('Update error:', err);
//       setMessage('Failed to update assignment');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this assignment?')) return;
//     try {
//       await deleteAssignment(id);
//       setMessage('Assignment deleted successfully');
//       loadAssignments();
//     } catch (err) {
//       console.error('Delete error:', err);
//       setMessage('Failed to delete assignment');
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Manage Assignments</h2>
//         <button
//           onClick={() => navigate('/admin/addassignment')}
//           className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all"
//         >
//           Click to Add Assignments
//         </button>
//       </div>

//       {message && <p className="mb-4 text-red-600 font-semibold">{message}</p>}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {assignments.map((assignment) => {
//           // Use apiBaseUrl from environment
//           const fullFileUrl = assignment.fileUrl
//             ? `${apiBaseUrl}${assignment.fileUrl}`
//             : '';

//           return (
//             <div
//               key={assignment._id}
//               className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border ring-1 ring-gray-200"
//             >
//               <h3 className="text-xl font-bold text-indigo-700 mb-2">
//                 {assignment.course?.title || 'Untitled Course'}
//               </h3>

//               {editingId === assignment._id ? (
//                 <>
//                   <input
//                     type="text"
//                     name="title"
//                     value={editForm.title}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 mb-3 rounded focus:ring focus:ring-indigo-300"
//                     placeholder="Title"
//                   />
//                   <textarea
//                     name="description"
//                     value={editForm.description}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 mb-3 rounded focus:ring focus:ring-indigo-300"
//                     placeholder="Description"
//                   />
//                   <input
//                     type="date"
//                     name="dueDate"
//                     value={editForm.dueDate}
//                     onChange={handleEditChange}
//                     className="w-full border p-2 mb-3 rounded focus:ring focus:ring-indigo-300"
//                   />
//                   {editForm.existingFileUrl && (
//                     <p className="mb-2 text-sm text-gray-600">
//                       <strong>Current File:</strong>{' '}
//                       <a
//                         href={`${apiBaseUrl}${editForm.existingFileUrl}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         View File
//                       </a>
//                     </p>
//                   )}
//                   <input
//                     type="file"
//                     name="file"
//                     accept=".pdf,.doc,.docx,.txt"
//                     onChange={handleEditChange}
//                     className="mb-4"
//                   />
//                 </>
//               ) : (
//                 <>
//                   <p className="text-gray-800"><strong>Title:</strong> {assignment.title}</p>
//                   <p className="text-gray-700 mt-1"><strong>Description:</strong> {assignment.description}</p>
//                   <p className="text-sm mt-2 text-gray-500">
//                     <strong>Due:</strong>{' '}
//                     <span className="text-red-500">
//                       {new Date(assignment.dueDate).toLocaleDateString()}
//                     </span>
//                   </p>
//                   {assignment.fileUrl ? (
//                     <p className="mt-3 text-sm text-gray-600">
//                       <strong>File:</strong>{' '}
//                       <a
//                         href={fullFileUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                       >
//                         View File
//                       </a>
//                     </p>
//                   ) : (
//                     <p className="mt-3 text-sm italic text-gray-400">No file uploaded</p>
//                   )}
//                 </>
//               )}

//               <div className="mt-5 flex gap-2">
//                 {editingId === assignment._id ? (
//                   <>
//                     <button
//                       onClick={() => saveEdit(assignment._id)}
//                       className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded"
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={() => setEditingId(null)}
//                       className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-1.5 rounded"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button
//                       onClick={() => startEditing(assignment)}
//                       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(assignment._id)}
//                       className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded"
//                     >
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ManageAssignment;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
} from '../../api/admin';

const ManageAssignment = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [assignments, setAssignments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    file: null,
    existingFileUrl: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [activeView, setActiveView] = useState('cards');
  const [submissionsData, setSubmissionsData] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [selectedSubmissionCourse, setSelectedSubmissionCourse] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await getAllAssignments();
      setAssignments(data || []);
    } catch (err) {
      console.error('Error loading assignments:', err);
      setMessage('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };


  const loadSubmissions = async () => {
    try {
      setSubmissionsLoading(true);
      const allSubmissions = [];
      
      for (const assignment of assignments) {
        try {
          const response = await getAssignmentSubmissions(assignment._id);
          const submissions = response.data.submissions.map(sub => ({
            ...sub,
            assignmentTitle: assignment.title,
            assignmentId: assignment._id,
            courseTitle: assignment.course?.title || 'No Course'
          }));
          allSubmissions.push(...submissions);
        } catch (err) {
          console.error(`Failed to fetch submissions for assignment ${assignment._id}:`, err);
        }
      }
      
      setSubmissionsData(allSubmissions);
      setTotalSubmissions(allSubmissions.length);
    } catch (err) {
      console.error('Error loading submissions:', err);
      setMessage('Failed to load submissions');
    } finally {
      setSubmissionsLoading(false);
    }
  };


  const startEditing = (assignment) => {
    setEditingId(assignment._id);
    setEditForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate?.split('T')[0] || '',
      file: null,
      existingFileUrl: assignment.fileUrl || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setEditForm({ ...editForm, file: files[0] });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const saveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('dueDate', editForm.dueDate);
      if (editForm.file) {
        formData.append('file', editForm.file);
      }

      await updateAssignment(id, formData);
      setEditingId(null);
      setMessage('Assignment updated successfully! ✅');
      loadAssignments();
      
      // Auto-hide success message
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setMessage('Failed to update assignment ❌');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAssignment(deleteId);
      setMessage('Assignment deleted successfully! 🗑️');
      loadAssignments();
      setShowDeleteModal(false);
      setDeleteId(null);
      
      // Auto-hide success message
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setMessage('Failed to delete assignment ❌');
      setShowDeleteModal(false);
    }
  };

  // Filter assignments based on search and course selection
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || 
                         assignment.course?.title === selectedCourse;
    return matchesSearch && matchesCourse;
  });


  // Get unique courses for filter dropdown
  const uniqueCourses = [...new Set(assignments.map(a => a.course?.title).filter(Boolean))];

  const filteredSubmissions = selectedSubmissionCourse === 'all' 
    ? submissionsData 
    : submissionsData.filter(sub => sub.courseTitle === selectedSubmissionCourse);

  // const uniqueCourses = [
  //   ...new Set(assignments.map((a) => a.course?.title).filter(Boolean)),
  // ];


  // Check if assignment is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Get days until due
  const getDaysUntilDue = (dueDate) => {
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Assignment Manager
              </h1>
              <p className="text-gray-600">Manage and organize your course assignments</p>
            </div>
            <button
              onClick={() => navigate('/admin/addassignment')}
              className="group relative px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Assignment
              </span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>

              {activeView === 'cards' ? (
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedSubmissionCourse}
                  onChange={(e) => setSelectedSubmissionCourse(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('cards')}
                  className={`px-4 py-3 rounded-xl transition-all ${activeView === 'cards' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
                >
                  Assignments
                </button>
                <button
                  onClick={() => {
                    setActiveView('submissions');
                    loadSubmissions();
                  }}
                  className={`px-4 py-3 rounded-xl transition-all ${activeView === 'submissions' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}
                >
                  Submissions
                </button>
              </div>

            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{filteredAssignments.length}</p>
                  <p className="text-sm text-gray-600">Total Assignments</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredAssignments.filter(a => isOverdue(a.dueDate)).length}
                  </p>
                  <p className="text-sm text-gray-600">Overdue</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {filteredAssignments.filter(a => !isOverdue(a.dueDate)).length}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {submissionsLoading ? (
                      <span className="inline-block h-6 w-8 bg-gray-200 rounded animate-pulse"></span>
                    ) : (
                      activeView === 'cards' ? totalSubmissions : filteredSubmissions.length
                    )}
                  </p>
                  <p className="text-sm text-gray-600">Submissions</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl shadow-md animate-pulse ${
            message.includes('successfully') || message.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}

        {/* Assignment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => {
            const fullFileUrl = assignment.fileUrl ? `${apiBaseUrl}${assignment.fileUrl}` : '';
            const daysUntilDue = getDaysUntilDue(assignment.dueDate);
            const overdue = isOverdue(assignment.dueDate);

            return (
              <div
                key={assignment._id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 ${
                  overdue ? 'border-l-red-500' : daysUntilDue <= 3 ? 'border-l-yellow-500' : 'border-l-green-500'
                } overflow-hidden`}
              >
                {/* Card Header */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-indigo-700 truncate">
                      {assignment.course?.title || 'Untitled Course'}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      overdue 
                        ? 'bg-red-100 text-red-800' 
                        : daysUntilDue <= 3 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {overdue ? 'Overdue' : daysUntilDue <= 0 ? 'Due Today' : `${daysUntilDue}d left`}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {editingId === assignment._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Assignment title"
                      />
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        placeholder="Assignment description"
                      />
                      <input
                        type="date"
                        name="dueDate"
                        value={editForm.dueDate}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      {editForm.existingFileUrl && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800 font-medium mb-1">Current File:</p>
                          <a
                            href={`${apiBaseUrl}${editForm.existingFileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            📎 View Current File
                          </a>
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="file"
                          name="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg mb-1">{assignment.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{assignment.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {assignment.fileUrl ? (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <a
                            href={fullFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 underline text-sm font-medium"
                          >
                            📎 View Attachment
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm italic">No attachment</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6">
                  {editingId === assignment._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(assignment._id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        💾 Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(assignment)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(assignment._id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>


        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No assignments found</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first assignment.</p>
            <button
              onClick={() => navigate('/admin/addassignment')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              Create Assignment
            </button>

            {/* Empty State */}
            {filteredAssignments.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No assignments found</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first assignment.</p>
                <button
                  onClick={() => navigate('/admin/addassignment')}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-semibold"
                >
                  Create Assignment
                </button>
              </div>
            )}
          </div>
        )} : (
          /* Submissions Table View */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  All Submissions ({filteredSubmissions.length})
                </h2>
                <p className="text-gray-600">View and manage all assignment submissions</p>
              </div>
              <select
                value={selectedSubmissionCourse}
                onChange={(e) => setSelectedSubmissionCourse(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-sm"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            
            {submissionsLoading ? (
              <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.assignmentTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.courseTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.studentEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            submission.status === 'submitted' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {submission.fileUrl && (
                            <a 
                              href={`${apiBaseUrl}${submission.fileUrl}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Download
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No submissions found</h3>
                <p className="text-gray-500 mb-6">Students haven't submitted any assignments yet.</p>
              </div>
            )}

          </div>
        
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Assignment</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this assignment? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAssignment;