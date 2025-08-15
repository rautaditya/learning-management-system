// src/pages/admin/EnrollmentList.jsx
import React, { useEffect, useState } from 'react';
import { getAllEnrollments } from '../../api/common';

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await getAllEnrollments();
        setEnrollments(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // Format date + time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Filter logic
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName = enrollment.student?.fullName?.toLowerCase() || '';
    const email = enrollment.student?.email?.toLowerCase() || '';
    const courseTitle = enrollment.courseId?.title?.toLowerCase() || '';
    const status = enrollment.status?.toLowerCase() || '';
    const createdAt = enrollment.createdAt ? new Date(enrollment.createdAt) : null;

    // Search filter
    const matchesSearch =
      studentName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      courseTitle.includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter ? status === statusFilter.toLowerCase() : true;

    // Date range filter
    const matchesDate = (() => {
      if (!startDate && !endDate) return true;
      if (!createdAt) return false;

      const start = startDate ? new Date(startDate + 'T00:00:00') : null;
      const end = endDate ? new Date(endDate + 'T23:59:59') : null;

      if (start && end) return createdAt >= start && createdAt <= end;
      if (start) return createdAt >= start;
      if (end) return createdAt <= end;
      return true;
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
  };

  if (loading) return <div className="p-4">Loading enrollments...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">All Enrollments</h2>

      {/* Filters Section */}
      <div className="bg-white shadow-md p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email, or course"
          className="px-4 py-2 border rounded-lg flex-1 min-w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Status Filter */}
        <select
          className="px-4 py-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <label className="text-gray-600">From:</label>
          <input
            type="date"
            className="px-3 py-2 border rounded-lg"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-600">To:</label>
          <input
            type="date"
            className="px-3 py-2 border rounded-lg"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border border-gray-200 rounded-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Student Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Enrolled On</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length > 0 ? (
              filteredEnrollments.map((enrollment) => (
                <tr key={enrollment._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{enrollment.student?.fullName || 'N/A'}</td>
                  <td className="py-2 px-4">{enrollment.student?.email || 'N/A'}</td>
                  <td className="py-2 px-4">{enrollment.courseId?.title || 'N/A'}</td>
                  <td
                    className={`py-2 px-4 capitalize font-medium ${
                      enrollment.status === 'active'
                        ? 'text-green-600'
                        : enrollment.status === 'completed'
                        ? 'text-blue-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {enrollment.status || 'N/A'}
                  </td>
                  <td className="py-2 px-4">
                    {formatDateTime(
                      enrollment.createdAt || enrollment.enrolledAt || enrollment.date
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentList;
