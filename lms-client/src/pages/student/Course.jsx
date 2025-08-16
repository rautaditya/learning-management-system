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

        setEnrolledIds(data);
      } catch (err) {
        console.error('Failed to load enrollments');
      }
    };

    fetchCourses();
    fetchEnrollments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center space-y-6">
          <div className="relative flex justify-center">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin absolute top-3"></div>
            <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-6"></div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl text-gray-700 font-bold">Loading Courses</p>
            <p className="text-gray-500">Discovering amazing learning opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-300/10 rounded-full animate-bounce delay-100"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-pink-300/10 rounded-full animate-ping delay-200"></div>
          <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-green-300/10 rounded-full animate-pulse delay-300"></div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute top-40 left-1/3 w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rotate-45 animate-spin"></div>
          <div className="absolute top-60 right-1/4 w-8 h-8 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rotate-12 animate-bounce"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Discover
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Amazing Courses
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
              Transform your future with world-class education from industry pioneers and thought leaders
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 border border-white/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-bold text-lg">{courses.length} Premium Courses</span>
              </div>
              
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-md rounded-full px-8 py-4 border border-yellow-400/30">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-lg text-yellow-100">Expert Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 text-slate-50">
            <path fill="currentColor" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Enhanced Course Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const isEnrolled = enrolledIds.includes(course._id);

            return (
              <div
                key={course._id}
                className="group relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-white/50 transform hover:-translate-y-4 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Status Badge */}
                {isEnrolled && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Enrolled</span>
                    </div>
                  </div>
                )}

                <div className="p-8 relative z-10">
                  {/* Enhanced Image Section */}
                  <div className="flex justify-center mb-6">
                    {course.courseImage ? (
                      <div className="relative">
                        <img
                          src={`http://localhost:5000/${course.courseImage.replace(/\\/g, '/')}`}
                          alt="course"
                          className="h-32 w-32 rounded-3xl object-cover shadow-2xl border-4 border-white/50 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    ) : (
                      <div className="h-32 w-32 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-white/50 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-16 h-16 text-blue-600/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Content */}
                  <div className="text-center space-y-4 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 leading-tight">
                      {course.title}
                    </h2>
                    <div className="text-gray-600 leading-relaxed">
                      {course.description?.length > 120 ? (
                        <div>
                          <p className="mb-2">
                            {course.description.substring(0, 120)}...
                          </p>
                          <button
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200"
                          >
                            Read more
                          </button>
                        </div>
                      ) : (
                        <p>{course.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Course Details */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-bold text-gray-700">{course.instructor}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <svg className="w-4 h-4 text-purple-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-bold text-gray-700">{course.duration}</span>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98A1 1 0 0117 18H9.236a1 1 0 01-.447-.106l-.535-.268a1 1 0 01.894-1.789l.18.09h6.672l-.5-1.002L13 8.618V9a1 1 0 11-2 0V8a1 1 0 012 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm font-bold text-gray-700">{course.language}</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Buttons */}
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
                          ? "flex-1 bg-green-500 text-white py-4 px-6 rounded-2xl font-bold cursor-not-allowed flex items-center justify-center space-x-2"
                          : "flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-2"
                      }
                    >
                      {isEnrolled ? (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>Enrolled</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Enroll Now</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="px-6 py-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl bg-white/80 backdrop-blur-sm flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Empty State */}
        {courses.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-16 max-w-lg mx-auto border border-white/50 shadow-2xl">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-700 mb-4">No Courses Available Yet</h3>
              <p className="text-gray-500 text-lg">Amazing courses are coming soon. Check back later for exciting learning opportunities!</p>
            </div>
          </div>
        )}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Courses;