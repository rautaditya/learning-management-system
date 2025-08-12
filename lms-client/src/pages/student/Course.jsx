import React, { useEffect, useState } from 'react';
import { getApprovedCourses } from '../../api/student';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getApprovedCourses();
        setCourses(data);
      } catch (err) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrollments = async () => {
      const token = localStorage.getItem('student_token');
      if (!token) return;

      try {
        const { data } = await axios.get('http://localhost:5000/api/student/enrollments', {
  headers: { Authorization: `Bearer ${token}` }
});

        setEnrolledIds(data); // array of course IDs
      } catch (err) {
        console.error('Failed to load enrollments');
      }
    };

    fetchCourses();
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">Loading approved courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-300 rounded-full animate-ping"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent">
            Discover Amazing Courses
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Unlock your potential with world-class courses from industry experts
          </p>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="font-semibold">{courses.length} Courses Available</span>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course) => {
            const isEnrolled = enrolledIds.includes(course._id);

            return (
              <div
                key={course._id}
                className="group relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 transform hover:-translate-y-3 hover:scale-105"
              >
                {/* Image */}
                <div className="flex-shrink-0">
                  {course.courseImage ? (
                    <img
                      src={`http://localhost:5000/${course.courseImage.replace(/\\/g, '/')}`}
                      alt="course"
                      className="h-24 w-24 rounded-2xl object-cover shadow-lg border-4 border-white/20"
                    />
                  ) : (
                    <div className="h-24 w-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20">
                      <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{course.description}</p>

                  {/* Course Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-3 bg-indigo-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      </div>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 bg-indigo-100 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        </div>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 bg-indigo-100 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        </div>
                        <span className="font-medium">{course.language}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        if (isEnrolled) {
                          toast.success('You are already enrolled in this course');
                        } else {
                          navigate(`/enroll/${course._id}`);
                        }
                      }}
                      disabled={isEnrolled}
                      className={
                        isEnrolled
                          ? "flex-1 bg-blue-500 text-white py-4 px-6 rounded-2xl font-bold cursor-not-allowed"
                          : "flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      }
                    >
                      {isEnrolled ? "Enrolled" : "Enroll"}
                    </button>

                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="px-6 py-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {courses.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/30">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No courses available</h3>
              <p className="text-gray-500">Check back later for new courses</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
