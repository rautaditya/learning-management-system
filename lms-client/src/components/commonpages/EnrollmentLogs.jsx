// src/pages/admin/EnrollmentList.jsx
import React, { useEffect, useState } from 'react';
import { getAllEnrollments } from '../../api/common';

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token'); // or use context if available

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await getAllEnrollments(token);
        setEnrollments(data);
        setLoading(false);
      } catch (err) {
        setError(err.toString());
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [token]);

  if (loading) return <div className="p-4">Loading enrollments...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Enrollments</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Student Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Course</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Enrolled On</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment._id} className="border-t">
                <td className="py-2 px-4">{enrollment.student?.fullName || 'N/A'}</td>
                <td className="py-2 px-4">{enrollment.student?.email || 'N/A'}</td>
                <td className="py-2 px-4">{enrollment.courseId?.title || 'N/A'}</td>
                <td className="py-2 px-4 capitalize">{enrollment.status}</td>
                <td className="py-2 px-4">{new Date(enrollment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentList;
