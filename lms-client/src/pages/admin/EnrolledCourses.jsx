import React, { useEffect, useState } from 'react';
import { fetchEnrolledCourses } from '../../api/admin';
import { getAllCourses } from '../../api/admin';

const EnrolledCourses = () => {
  const [data, setData] = useState([]);
  const [courseList, setCourseList] = useState([]);

  const [searchName, setSearchName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [enrollDate, setEnrollDate] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const enrollments = await fetchEnrolledCourses(); // this should return populated courseId and student
        const courses = await getAllCourses(); // list of all courses
        setData(enrollments);
        setCourseList(courses);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, []);

  const filtered = data.filter((item) => {
    const matchName = item.student?.fullName.toLowerCase().includes(searchName.toLowerCase());
    const matchCourse = selectedCourse ? item.courseId?.title === selectedCourse : true;
    const matchStatus = statusFilter ? item.progress?.toLowerCase().includes(statusFilter.toLowerCase()) : true;
    const matchDate = enrollDate
      ? new Date(item.enrolledAt).toISOString().split('T')[0] === enrollDate
      : true;

    return matchName && matchCourse && matchStatus && matchDate;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Enrolled Students</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Student Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 border rounded w-full"
        />

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">All Courses</option>
          {courseList.map((course) => (
            <option key={course._id} value={course.title}>
              {course.title}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>

        <input
          type="date"
          value={enrollDate}
          onChange={(e) => setEnrollDate(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border shadow-md rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Student Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Course</th>
              <th className="px-4 py-2 text-left">Enrollment Date</th>
              <th className="px-4 py-2 text-left">Progress</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((entry, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{entry.student?.fullName}</td>
                  <td className="px-4 py-2">{entry.student?.email}</td>
                  <td className="px-4 py-2">{entry.courseId?.title}</td>
                  <td className="px-4 py-2">
                    {new Date(entry.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        entry.progress === 'Completed'
                          ? 'bg-green-100 text-green-600'
                          : entry.progress?.includes('/')
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {entry.progress || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-blue-600 cursor-pointer hover:underline">View</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrolledCourses;
