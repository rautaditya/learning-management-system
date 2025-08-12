import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { getEnrolledExams, checkExamSubmission } from '../../api/student';
import { Clock, BookOpen, Calendar, CheckCircle, XCircle, Award, AlertCircle, FileText } from 'lucide-react';

const Exam = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, expired, submitted

  const studentData = JSON.parse(localStorage.getItem('student_user'));
  const studentId = studentData?.id;

  useEffect(() => {
    const fetchAvailableExams = async () => {
      try {
        if (!studentId) {
          console.error('Student ID not found in localStorage');
          return;
        }

        const exams = await getEnrolledExams(studentId);

        const updatedExams = await Promise.all(
          exams.map(async (exam) => {
            const submitted = await checkExamSubmission(exam._id);
            return { ...exam, submitted };
          })
        );

        setExams(updatedExams);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableExams();
  }, [studentId]);

  const filteredExams = exams.filter(exam => {
    const isExpired = moment().isAfter(exam.examDueDate);
    switch (filter) {
      case 'active':
        return !isExpired && !exam.submitted;
      case 'expired':
        return isExpired;
      case 'submitted':
        return exam.submitted;
      default:
        return true;
    }
  });

  const getStatusCounts = () => {
    const active = exams.filter(exam => !moment().isAfter(exam.examDueDate) && !exam.submitted).length;
    const expired = exams.filter(exam => moment().isAfter(exam.examDueDate)).length;
    const submitted = exams.filter(exam => exam.submitted).length;
    return { active, expired, submitted };
  };

  const { active, expired, submitted } = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading your exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Available Exams</h1>
                <p className="text-gray-600">Your enrolled course examinations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{submitted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">{expired}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            All Exams ({exams.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'active'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Active ({active})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'submitted'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Submitted ({submitted})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'expired'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Expired ({expired})
          </button>
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === 'all' 
                ? 'No exams available for your enrolled courses.'
                : `No ${filter} exams found. Try changing the filter.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const dueDateFormatted = moment(exam.examDueDate).format('MMMM Do YYYY, h:mm A');
              const isExpired = moment().isAfter(exam.examDueDate);
              const timeLeft = moment(exam.examDueDate).fromNow();

              return (
                <div
                  key={exam._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {exam.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {exam.course?.title || 'Unknown Course'}
                        </div>
                      </div>
                      <div className="ml-4">
                        {exam.submitted ? (
                          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Submitted
                          </div>
                        ) : isExpired ? (
                          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                            <XCircle className="h-3 w-3 inline mr-1" />
                            Expired
                          </div>
                        ) : (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Active
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {exam.description || 'No description available'}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-4 w-4 mr-2" />
                          <span>Total Marks</span>
                        </div>
                        <span className="font-semibold text-gray-900">{exam.totalMarks}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Due Date</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {dueDateFormatted}
                        </span>
                      </div>

                      {!isExpired && !exam.submitted && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Time Left</span>
                          </div>
                          <span className="text-sm font-medium text-orange-600">
                            {timeLeft}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0">
                    {exam.submitted ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                        <p className="text-emerald-700 font-medium">Already Attended</p>
                      </div>
                    ) : isExpired ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-red-700 font-medium">Exam Expired</p>
                      </div>
                    ) : (
                      <button
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        onClick={() => window.location.href = `/exam/${exam._id}/take`}
                      >
                        <div className="flex items-center justify-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Attend Exam
                        </div>
                      </button>
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

export default Exam;