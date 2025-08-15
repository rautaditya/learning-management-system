import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Download, 
  FileText, 
  Clock, 
  User, 
  GraduationCap, 
  AlertCircle, 
  Video, 
  Upload,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getMyAssignments, submitStudentAssignment } from '../../api/student';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

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

  const handleFileChange = (e) => {
    setSubmissionFile(e.target.files[0]);
    setSubmissionError('');
  };

const handleSubmitAssignment = async () => {
  if (!submissionFile) {
    setSubmissionError('Please select a file to upload');
    return;
  }

  if (!selectedAssignment) {
    setSubmissionError('No assignment selected');
    return;
  }

  setIsSubmitting(true);
  setSubmissionError('');

  try {
    const formData = new FormData();
    formData.append('file', submissionFile);

    // ✅ Get student ID from correct key
const studentData = JSON.parse(localStorage.getItem('student_user') || '{}');
const studentId = studentData.id;

if (!studentId) {
  console.error('Student ID not found in local storage');
  return;
}



    const updatedAssignment = await submitStudentAssignment(
      selectedAssignment._id,
      studentId,
      formData
    );

    setAssignments(assignments.map(assignment =>
      assignment._id === updatedAssignment._id ? updatedAssignment : assignment
    ));

    setSelectedAssignment(null);
    setSubmissionFile(null);
  } catch (err) {
    console.error('Error submitting assignment:', err);
    setSubmissionError(err.response?.data?.error || err.message || 'Failed to submit assignment');
  } finally {
    setIsSubmitting(false);
  }
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
              const hasSubmitted = assignment.submissions?.length > 0;
              
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

                    {/* Submission Status */}
                    {hasSubmitted && (
                      <div className="mb-4 p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Submitted
                        </h4>
                        <p className="text-green-700 text-sm">
                          You submitted on {new Date(assignment.submissions[0].submittedAt).toLocaleString()}
                        </p>
                        {assignment.submissions[0].fileUrl && (
                          <a 
                            href={assignment.submissions[0].fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-green-600 hover:underline mt-2"
                          >
                            <Download className="h-3 w-3" />
                            View Submission
                          </a>
                        )}
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

                    {/* Submission Button */}
                    {(!hasSubmitted || assignment.allowResubmission) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                        >
                          <Upload className="h-4 w-4" />
                          {hasSubmitted ? 'Resubmit Assignment' : 'Submit Assignment'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Submit Assignment</h3>
              <button 
                onClick={() => {
                  setSelectedAssignment(null);
                  setSubmissionFile(null);
                  setSubmissionError('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="mb-2"><strong>Assignment:</strong> {selectedAssignment.title}</p>
              <p><strong>Course:</strong> {selectedAssignment.course?.title}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your submission
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {submissionFile ? (
                        <span className="font-medium text-indigo-600">{submissionFile.name}</span>
                      ) : (
                        <>
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX, PPTX (Max 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="opacity-0 absolute" 
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                  />
                </label>
              </div>
            </div>

            {submissionError && (
              <div className="text-red-500 text-sm mb-4 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {submissionError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedAssignment(null);
                  setSubmissionFile(null);
                  setSubmissionError('');
                }}
                className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssignment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;