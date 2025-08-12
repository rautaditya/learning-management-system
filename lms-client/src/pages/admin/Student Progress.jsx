import React, { useEffect, useState } from "react";
import {
  getCourses,
  getAllCourseStudents,
  getCourseStudents,
  getFullStudentProgress,
} from "../../api/common";
import { toast } from "react-toastify";
import { 
  BookOpen, 
  Users, 
  PlayCircle, 
  FileText, 
  Award, 
  TrendingUp, 
  User,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";

const StudentProgress = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [courseRes, studentRes] = await Promise.all([
          getCourses(),
          getAllCourseStudents(),
        ]);
        setCourses(courseRes.data || []);
        setFilteredStudents(studentRes.data.students || []);
      } catch (err) {
        toast.error("Error loading initial data");
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setSelectedStudent(null);
        setStudentDetails(null);

        if (selectedCourseId === "all") {
          const res = await getAllCourseStudents();
          setFilteredStudents(res.data.students || []);
        } else {
          const res = await getCourseStudents(selectedCourseId);
          setFilteredStudents(res.data.students || []);
        }
      } catch (err) {
        toast.error("Failed to fetch students for selected course");
      }
    };

    fetchStudents();
  }, [selectedCourseId]);

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    setLoadingProgress(true);
    try {
      const courseId = student.courseId;
      if (!courseId) {
        toast.error("Course ID missing for selected student.");
        return;
      }
      const res = await getFullStudentProgress(courseId, student.id);
      setStudentDetails(res.data);
    } catch (err) {
      toast.error("Failed to load student progress");
      setStudentDetails(null);
    }
    setLoadingProgress(false);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "text-green-600 bg-green-100";
    if (progress >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredStudentsList = filteredStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Progress Tracker</h1>
              <p className="text-gray-600 mt-1">Monitor and analyze student performance across all courses</p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Course Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Filter by Course:</label>
              </div>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm min-w-48"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm min-w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Students ({filteredStudentsList.length})
                  </h3>
                </div>
              </div>
              
              <div className="p-6">
                {filteredStudentsList.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No students found</p>
                    <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStudentsList.map((student, index) => (
                      <div
                        key={`${student.id}-${student.courseId || index}`}
                        className={`group p-4 border rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md ${
                          selectedStudent?.id === student.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleStudentClick(student)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {student.name}
                              </h4>
                              <p className="text-sm text-gray-500">{student.email}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                📚 {student.courseTitle || "N/A"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(student.progress || 0)}`}>
                                <TrendingUp className="w-3 h-3" />
                                {student.progress || 0}%
                              </div>
                              <div className="w-20 h-2 bg-gray-200 rounded-full mt-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(student.progress || 0)}`}
                                  style={{ width: `${student.progress || 0}%` }}
                                />
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-6">
              {selectedStudent ? (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedStudent.name}</h3>
                        <p className="text-sm text-gray-500">Progress Details</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {loadingProgress ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading progress...</p>
                      </div>
                    ) : studentDetails ? (
                      <div className="space-y-6">
                        {/* Course Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Course</span>
                          </div>
                          <p className="text-blue-800 font-semibold">{selectedStudent.courseTitle || "N/A"}</p>
                        </div>

                        {/* Progress Overview */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-900">Overall</span>
                            </div>
                            <p className="text-2xl font-bold text-green-800">{studentDetails.progress || 0}%</p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-900">Score</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-800">{studentDetails.totalExamScore || 0}</p>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <PlayCircle className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">Videos</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              {studentDetails.completedVideos?.length || 0}/{studentDetails.totalVideos || 0}
                            </p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">Exams</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                              {studentDetails.completedExams?.length || 0}/{studentDetails.totalExams || 0}
                            </p>
                          </div>
                        </div>

                        {/* Completed Videos */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <PlayCircle className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">Completed Videos</h4>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {studentDetails.completedVideos?.length > 0 ? (
                              <div className="space-y-2">
                                {studentDetails.completedVideos.map((video) => (
                                  <div key={video._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-sm font-medium text-gray-700">{video.title}</span>
                                    </div>
                                    {video.duration && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        {video.duration}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm py-4 text-center">No videos completed yet</p>
                            )}
                          </div>
                        </div>

                        {/* Completed Exams */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <h4 className="font-semibold text-gray-900">Completed Exams</h4>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {studentDetails.completedExams?.length > 0 ? (
                              <div className="space-y-2">
                                {studentDetails.completedExams.map((exam) => (
                                  <div key={exam._id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <span className="text-sm font-medium text-gray-700">{exam.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-purple-600">
                                      <Award className="w-3 h-3" />
                                      {exam.totalMarks} pts
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm py-4 text-center">No exams completed yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No progress data available</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center py-12">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Select a student</p>
                  <p className="text-gray-400 text-sm mt-2">Click on any student to view their detailed progress</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;