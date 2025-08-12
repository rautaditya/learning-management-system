// import React, { useEffect, useState } from 'react';
// import { getAllExams, updateExamById, deleteExamById } from '../../api/admin';
// import { 
//   BookOpen, 
//   Calendar, 
//   Users, 
//   Edit3, 
//   Trash2, 
//   ChevronDown, 
//   ChevronUp, 
//   Save, 
//   X, 
//   Clock,
//   Award,
//   User,
//   Eye,
//   EyeOff,
//   Search,
//   Filter
// } from 'lucide-react';

// const ManageExam = () => {
//   const [exams, setExams] = useState([]);
//   const [filteredExams, setFilteredExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedExamId, setExpandedExamId] = useState(null);
//   const [editingExamId, setEditingExamId] = useState(null);
//   const [editForm, setEditForm] = useState({ title: '', description: '', totalMarks: '', questions: [] });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterBy, setFilterBy] = useState('all');
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         const res = await getAllExams();
//         setExams(res.exams);
//         setFilteredExams(res.exams);
//       } catch (error) {
//         console.error('Error fetching exams:', error.message || error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchExams();
//   }, []);

//   useEffect(() => {
//     let filtered = exams;
    
//     if (searchTerm) {
//       filtered = filtered.filter(exam =>
//         exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         exam.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterBy !== 'all') {
//       const now = new Date();
//       filtered = filtered.filter(exam => {
//         const dueDate = new Date(exam.dueDate);
//         if (filterBy === 'active') return dueDate > now;
//         if (filterBy === 'expired') return dueDate <= now;
//         return true;
//       });
//     }

//     setFilteredExams(filtered);
//   }, [searchTerm, filterBy, exams]);

//   const toggleQuestions = (examId) => {
//     setExpandedExamId((prevId) => (prevId === examId ? null : examId));
//   };

//   const handleEditClick = (exam) => {
//     setEditingExamId(exam._id);
//     setEditForm({
//       title: exam.title,
//       description: exam.description,
//       totalMarks: exam.totalMarks,
//       questions: exam.questions || []
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingExamId(null);
//     setEditForm({ title: '', description: '', totalMarks: '', questions: [] });
//   };

//   const handleInputChange = (e, field) => {
//     setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
//   };

//   const handleQuestionChange = (index, field, value) => {
//     const updatedQuestions = [...editForm.questions];
//     updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
//     setEditForm((prev) => ({ ...prev, questions: updatedQuestions }));
//   };

//   const handleUpdateExam = async (id) => {
//     try {
//       const res = await updateExamById(id, editForm);
//       const updated = exams.map((ex) => (ex._id === id ? res.exam : ex));
//       setExams(updated);
//       setEditingExamId(null);
//     } catch (err) {
//       console.error('Error updating exam:', err.message || err);
//       alert(err.message || 'Failed to update exam');
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteExamById(id);
//       setExams((prev) => prev.filter((ex) => ex._id !== id));
//       setDeleteConfirm(null);
//     } catch (err) {
//       console.error('Error deleting exam:', err);
//     }
//   };

//   const getStatusColor = (dueDate) => {
//     if (!dueDate) return 'bg-gray-100 text-gray-600';
//     const now = new Date();
//     const due = new Date(dueDate);
//     const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 0) return 'bg-red-100 text-red-700';
//     if (diffDays <= 3) return 'bg-yellow-100 text-yellow-700';
//     return 'bg-green-100 text-green-700';
//   };

//   const getStatusText = (dueDate) => {
//     if (!dueDate) return 'No Due Date';
//     const now = new Date();
//     const due = new Date(dueDate);
//     const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
//     if (diffDays < 0) return 'Expired';
//     if (diffDays === 0) return 'Due Today';
//     if (diffDays <= 3) return `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
//     return 'Active';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-600 text-lg">Loading exams...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   Exam Management
//                 </h1>
//                 <p className="text-gray-600 mt-2">Manage and monitor all your exams in one place</p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="bg-blue-100 p-4 rounded-xl">
//                   <BookOpen className="h-8 w-8 text-blue-600" />
//                 </div>
//                 <div className="text-right">
//                   <p className="text-2xl font-bold text-gray-800">{exams.length}</p>
//                   <p className="text-sm text-gray-600">Total Exams</p>
//                 </div>
//               </div>
//             </div>

//             {/* Search and Filter Section */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   type="text"
//                   placeholder="Search exams by title, description, or course..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div>
//               <div className="relative">
//                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <select
//                   value={filterBy}
//                   onChange={(e) => setFilterBy(e.target.value)}
//                   className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
//                 >
//                   <option value="all">All Exams</option>
//                   <option value="active">Active</option>
//                   <option value="expired">Expired</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Exams Grid */}
//         {filteredExams.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
//             <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">No exams found</h3>
//             <p className="text-gray-500">
//               {searchTerm || filterBy !== 'all' 
//                 ? 'Try adjusting your search or filter criteria.' 
//                 : 'Create your first exam to get started.'}
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {filteredExams.map((exam) => (
//               <div key={exam._id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
//                 {editingExamId === exam._id ? (
//                   <div className="p-6">
//                     <div className="mb-4">
//                       <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Exam</h3>
//                       <div className="space-y-4">
//                         <input 
//                           value={editForm.title} 
//                           onChange={(e) => handleInputChange(e, 'title')} 
//                           placeholder="Exam Title"
//                           className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//                         />
//                         <textarea 
//                           value={editForm.description} 
//                           onChange={(e) => handleInputChange(e, 'description')} 
//                           placeholder="Exam Description"
//                           rows="3"
//                           className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
//                         />
//                         <input 
//                           value={editForm.totalMarks} 
//                           onChange={(e) => handleInputChange(e, 'totalMarks')} 
//                           placeholder="Total Marks"
//                           type="number"
//                           className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//                         />
//                       </div>
//                     </div>

//                     {/* Edit Questions */}
//                     {editForm.questions.length > 0 && (
//                       <div className="mb-4">
//                         <h4 className="font-semibold text-gray-800 mb-3">Questions ({editForm.questions.length})</h4>
//                         <div className="max-h-64 overflow-y-auto space-y-3">
//                           {editForm.questions.map((q, idx) => (
//                             <div key={idx} className="bg-gray-50 p-3 rounded-xl border">
//                               <p className="text-sm font-medium text-gray-600 mb-2">Question {idx + 1}</p>
//                               <textarea
//                                 className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2 resize-none"
//                                 value={q.questionText}
//                                 onChange={(e) => handleQuestionChange(idx, 'questionText', e.target.value)}
//                                 rows="2"
//                               />
//                               <input
//                                 className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2"
//                                 placeholder="Options (comma separated)"
//                                 value={q.options?.join(', ') || ''}
//                                 onChange={(e) => handleQuestionChange(idx, 'options', e.target.value.split(',').map(s => s.trim()))}
//                               />
//                               <div className="flex gap-2">
//                                 <input
//                                   className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
//                                   type="number"
//                                   placeholder="Correct Index"
//                                   value={q.correctOptionIndex || ''}
//                                   onChange={(e) => handleQuestionChange(idx, 'correctOptionIndex', Number(e.target.value))}
//                                 />
//                                 <input
//                                   className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
//                                   type="number"
//                                   placeholder="Marks"
//                                   value={q.marks || ''}
//                                   onChange={(e) => handleQuestionChange(idx, 'marks', Number(e.target.value))}
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="flex gap-3">
//                       <button 
//                         onClick={() => handleUpdateExam(exam._id)} 
//                         className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
//                       >
//                         <Save className="h-4 w-4" />
//                         Save Changes
//                       </button>
//                       <button 
//                         onClick={handleCancelEdit} 
//                         className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
//                       >
//                         <X className="h-4 w-4" />
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     {/* Exam Card Header */}
//                     <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
//                       <div className="flex items-start justify-between mb-4">
//                         <h3 className="text-xl font-bold leading-tight">{exam.title}</h3>
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.dueDate)}`}>
//                           {getStatusText(exam.dueDate)}
//                         </span>
//                       </div>
//                       <p className="text-blue-100 text-sm line-clamp-2">{exam.description}</p>
//                     </div>

//                     {/* Exam Card Body */}
//                     <div className="p-6">
//                       <div className="grid grid-cols-2 gap-4 mb-6">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-blue-100 p-2 rounded-lg">
//                             <BookOpen className="h-4 w-4 text-blue-600" />
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Course</p>
//                             <p className="font-medium text-gray-800 text-sm">{exam.course?.title || 'N/A'}</p>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center gap-3">
//                           <div className="bg-purple-100 p-2 rounded-lg">
//                             <Award className="h-4 w-4 text-purple-600" />
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Total Marks</p>
//                             <p className="font-medium text-gray-800 text-sm">{exam.totalMarks}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <div className="bg-green-100 p-2 rounded-lg">
//                             <Clock className="h-4 w-4 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Due Date</p>
//                             <p className="font-medium text-gray-800 text-sm">
//                               {exam.dueDate ? new Date(exam.dueDate).toLocaleDateString() : 'N/A'}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                           <div className="bg-orange-100 p-2 rounded-lg">
//                             <User className="h-4 w-4 text-orange-600" />
//                           </div>
//                           <div>
//                             <p className="text-xs text-gray-500">Created By</p>
//                             <p className="font-medium text-gray-800 text-sm">{exam.createdBy?.fullName || 'N/A'}</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Questions Section */}
//                       <div className="mb-6">
//                         <button 
//                           className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
//                           onClick={() => toggleQuestions(exam._id)}
//                         >
//                           <div className="flex items-center gap-2">
//                             {expandedExamId === exam._id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                             <span className="font-medium">Questions ({exam.questions?.length || 0})</span>
//                           </div>
//                           {expandedExamId === exam._id ? 
//                             <ChevronUp className="h-4 w-4" /> : 
//                             <ChevronDown className="h-4 w-4" />
//                           }
//                         </button>

//                         {expandedExamId === exam._id && exam.questions?.length > 0 && (
//                           <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
//                             {exam.questions.map((q, index) => {
//                               const correctAnswer =
//                                 typeof q.correctOptionIndex === 'number' && Array.isArray(q.options)
//                                   ? q.options[q.correctOptionIndex]
//                                   : q.correctOptionIndex || 'N/A';

//                               return (
//                                 <div key={index} className="bg-gray-50 p-4 rounded-xl border">
//                                   <div className="flex items-start justify-between mb-2">
//                                     <h5 className="font-medium text-gray-800">Question {index + 1}</h5>
//                                     <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
//                                       {q.marks} pts
//                                     </span>
//                                   </div>
//                                   <p className="text-gray-700 mb-3 text-sm">{q.questionText}</p>
//                                   {q.options && (
//                                     <div className="space-y-1 mb-2">
//                                       <p className="text-xs font-medium text-gray-600">Options:</p>
//                                       <div className="grid grid-cols-1 gap-1">
//                                         {q.options.map((option, optIdx) => (
//                                           <span 
//                                             key={optIdx} 
//                                             className={`text-xs px-2 py-1 rounded ${
//                                               optIdx === q.correctOptionIndex 
//                                                 ? 'bg-green-100 text-green-700 font-medium' 
//                                                 : 'bg-gray-100 text-gray-600'
//                                             }`}
//                                           >
//                                             {String.fromCharCode(65 + optIdx)}. {option}
//                                           </span>
//                                         ))}
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         )}
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-3">
//                         <button 
//                           onClick={() => handleEditClick(exam)} 
//                           className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
//                         >
//                           <Edit3 className="h-4 w-4" />
//                           Edit
//                         </button>
//                         <button 
//                           onClick={() => setDeleteConfirm(exam._id)} 
//                           className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {deleteConfirm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
//               <div className="text-center">
//                 <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//                   <Trash2 className="h-8 w-8 text-red-600" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Exam</h3>
//                 <p className="text-gray-600 mb-6">
//                   Are you sure you want to delete this exam? This action cannot be undone.
//                 </p>
//                 <div className="flex gap-3">
//                   <button 
//                     onClick={() => setDeleteConfirm(null)} 
//                     className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     onClick={() => handleDelete(deleteConfirm)} 
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageExam;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getAllExams, updateExamById, deleteExamById } from '../../api/admin';
import {
  BookOpen,
  Clock,
  User,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const ManageExam = () => {
  const [exams, setExams] = useState([]);
  const [expandedExamId, setExpandedExamId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await getAllExams();
        setExams(res.exams);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const getStatusColor = (examDueDate) => {
    if (!examDueDate) return 'bg-gray-100 text-gray-600';
    const now = new Date();
    const due = new Date(examDueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'bg-red-100 text-red-700';
    if (diffDays <= 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (examDueDate) => {
    if (!examDueDate) return 'No Due Date';
    const now = new Date();
    const due = new Date(examDueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Due Today';
    if (diffDays <= 3) return `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    return 'Active';
  };

  const toggleQuestions = (id) => {
    setExpandedExamId((prev) => (prev === id ? null : id));
  };

  if (loading) return <div className="text-center py-10">Loading exams...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Exams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam._id} className="bg-white p-4 rounded-xl shadow border">
            <div className="flex justify-between items-center mb-2">
             <Link
              to={`/admin/questionpaper/${exam._id}`}
               className="text-lg font-semibold text-blue-600 hover:underline">
              {exam.title}
                 </Link>

              <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(exam.examDueDate)}`}>
                {getStatusText(exam.examDueDate)}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{exam.description}</p>

            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Course: {exam.course?.title || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span>Due Date: {exam.examDueDate ? new Date(exam.examDueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <span>Created By: {exam.createdBy?.fullName || 'N/A'}</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => toggleQuestions(exam._id)}
                className="text-sm text-blue-500 hover:underline flex items-center gap-1"
              >
                {expandedExamId === exam._id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {expandedExamId === exam._id ? 'Hide Questions' : 'Show Questions'}
              </button>
              {expandedExamId === exam._id && (
                <ul className="mt-2 space-y-2 text-sm">
                  {exam.questions.map((q, i) => (
                    <li key={i} className="bg-gray-50 p-2 rounded">
                      <strong>Q{i + 1}:</strong> {q.questionText}<br />
                      <em>Options:</em> {q.options.join(', ')}<br />
                      <em>Correct:</em> {q.options[q.correctOptionIndex] || 'N/A'}, <em>Marks:</em> {q.marks}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageExam;
