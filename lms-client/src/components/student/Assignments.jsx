// import React, { useEffect, useState } from 'react';
// import { getMyAssignments } from '../../api/student';

// const Assignments = () => {
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         const data = await getMyAssignments();
//         setAssignments(data);
//       } catch (err) {
//         console.error('Error fetching assignments:', err);
//         setError('Failed to fetch assignments');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignments();
//   }, []);

//   if (loading) return <div>Loading assignments...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">My Assignments</h2>
//       {assignments.length === 0 ? (
//         <div>No assignments found for your enrolled courses.</div>
//       ) : (
//         <ul className="space-y-4">
//           {assignments.map((assignment) => (
//             <li key={assignment._id} className="border p-4 rounded shadow">
//               <h3 className="font-semibold text-lg">{assignment.title}</h3>
//               <p><strong>Course:</strong> {assignment.course?.title}</p>
//               <p><strong>Video:</strong> {assignment.video ? assignment.video.title : 'Not linked to a video'}</p>
//               <p><strong>Description:</strong> {assignment.description || 'No description provided'}</p>
//               <p><strong>File URL:</strong> {assignment.fileUrl ? (
//                 <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Download</a>
//               ) : 'No file attached'}</p>
//               <p><strong>Due Date:</strong> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</p>
//               <p><strong>Created By:</strong> {assignment.createdBy?.fullName}</p>
//               <p><strong>Created At:</strong> {new Date(assignment.createdAt).toLocaleString()}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Assignments;
import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, Download, FileText, Clock, User, GraduationCap, AlertCircle, Video } from 'lucide-react';
import { getMyAssignments } from '../../api/student';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getMyAssignments();
        setAssignments(data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', color: 'text-red-600 bg-red-50' };
    if (diffDays <= 3) return { status: 'urgent', color: 'text-orange-600 bg-orange-50' };
    if (diffDays <= 7) return { status: 'upcoming', color: 'text-yellow-600 bg-yellow-50' };
    return { status: 'normal', color: 'text-green-600 bg-green-50' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">My Assignments</h1>
          </div>
          <p className="text-gray-600">Stay on top of your coursework and deadlines</p>
        </div>

        {/* Assignments Count */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span className="text-gray-700 font-medium">
                {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Updated {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No assignments yet</h3>
            <p className="text-gray-600">No assignments found for your enrolled courses.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((assignment) => {
              const dueDateStatus = getDueDateStatus(assignment.dueDate);
              
              return (
                <div key={assignment._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {assignment.title}
                        </h3>
                        {dueDateStatus && (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${dueDateStatus.color}`}>
                            <Clock className="h-4 w-4 mr-1" />
                            {dueDateStatus.status === 'overdue' && 'Overdue'}
                            {dueDateStatus.status === 'urgent' && 'Due Soon'}
                            {dueDateStatus.status === 'upcoming' && 'Upcoming'}
                            {dueDateStatus.status === 'normal' && 'On Track'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Course and Video Info */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <GraduationCap className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Course</p>
                          <p className="text-sm text-gray-600">{assignment.course?.title || 'No course linked'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Video className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Video</p>
                          <p className="text-sm text-gray-600">{assignment.video ? assignment.video.title : 'Not linked to a video'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {assignment.description && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{assignment.description}</p>
                      </div>
                    )}

                    {/* Footer Info */}
                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Due Date</p>
                          <p className="text-sm font-medium text-gray-700">
                            {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Created By</p>
                          <p className="text-sm font-medium text-gray-700">{assignment.createdBy?.fullName || 'Unknown'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-sm font-medium text-gray-700">{new Date(assignment.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* File Download */}
                    {assignment.fileUrl && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href={assignment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                        >
                          <Download className="h-4 w-4" />
                          Download Assignment File
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;