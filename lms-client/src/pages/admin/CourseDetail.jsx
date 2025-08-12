import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../../api/student';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getCourseById(id);
      setCourse(data);
      setLoading(false);
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-pink-100">
        <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600">This course doesn't exist or may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 pb-10">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Hero */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
            <div className="flex gap-6 items-center">
              {course.courseImage ? (
                <img
                  src={`http://localhost:5000/${course.courseImage.replace(/\\/g, '/')}`}
                  alt="course"
                  className="w-28 h-28 object-cover rounded-2xl border-4 border-white/30 shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 bg-white/20 rounded-2xl flex items-center justify-center border-4 border-white/20">
                  <svg className="w-10 h-10 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-bold tracking-tight mb-2">{course.title}</h1>
                <p className="text-white/90 leading-relaxed text-base">{course.description}</p>
                <div className="mt-4 flex gap-3 flex-wrap">
                  <span className="bg-white/20 text-sm px-4 py-2 rounded-full font-medium">{course.category}</span>
                  <span className="bg-white/20 text-sm px-4 py-2 rounded-full font-medium">{course.level}</span>
                  {course.approved && (
                    <span className="bg-green-500/20 text-sm px-4 py-2 rounded-full font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Approved
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Info */}
            <SectionCard title="Course Information" iconColor="blue" iconPath="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem label="Instructor" value={course.instructor} color="purple" />
                <InfoItem label="Duration" value={course.duration} color="green" />
                <InfoItem label="Language" value={course.language} color="blue" />
                <InfoItem label="Certification" value={course.certification} color="orange" />
                <InfoItem
                  label="Price"
                  value={
                    course.priceType === 'Free'
                      ? <span className="text-green-600 font-bold">Free</span>
                      : <span className="text-blue-600 font-bold">₹{course.price}</span>
                  }
                  color="yellow"
                />
                {course.createdBy && (
                  <InfoItem label="Created By" value={course.createdBy.name || course.createdBy.email} color="gray" />
                )}
              </div>
            </SectionCard>

            {/* Syllabus */}
            <SectionCard title="Course Syllabus" iconColor="indigo" iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 text-gray-700 whitespace-pre-wrap leading-relaxed">{course.syllabus}</div>
            </SectionCard>

            {/* Prerequisites */}
            <SectionCard title="Prerequisites" iconColor="red" iconPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z">
              <div className="bg-red-50 p-5 rounded-xl border border-red-100 text-gray-700 whitespace-pre-wrap leading-relaxed">{course.prerequisites}</div>
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 sticky top-10">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Actions</h3>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Courses
              </button>
            </div>

            {/* Approval Info */}
            {(course.approvedBy || course.approvedAt) && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Approval Details
                </h3>
                <div className="space-y-3">
                  {course.approvedBy && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Approved By:</span>
                      <span className="text-sm font-semibold text-green-700">
                        {course.approvedBy.name || course.approvedBy.email || 'Superadmin'}
                      </span>
                    </div>
                  )}
                  {course.approvedAt && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Approved On:</span>
                      <span className="text-sm font-semibold text-blue-700">
                        {new Date(course.approvedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Section
const SectionCard = ({ title, iconColor, iconPath, children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
      <div className={`w-8 h-8 bg-${iconColor}-100 rounded-lg flex items-center justify-center`}>
        <svg className={`w-5 h-5 text-${iconColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
        </svg>
      </div>
      {title}
    </h2>
    {children}
  </div>
);

// Reusable Info Item
const InfoItem = ({ label, value, color }) => (
  <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl">
    <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center`}>
      <div className={`w-4 h-4 rounded-full bg-${color}-600`}></div>
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default CourseDetail;
