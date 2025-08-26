// // src/pages/admin/EnrollmentList.jsx
// import React, { useEffect, useState } from 'react';
// import { getAllEnrollments } from '../../api/common';

// const EnrollmentList = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   useEffect(() => {
//     const fetchEnrollments = async () => {
//       try {
//         const data = await getAllEnrollments();
//         setEnrollments(Array.isArray(data) ? data : []);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || 'Something went wrong');
//         setLoading(false);
//       }
//     };

//     fetchEnrollments();
//   }, []);

//   // Format date + time
//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'N/A';
//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   // Filter logic
//   const filteredEnrollments = enrollments.filter((enrollment) => {
//     const studentName = enrollment.student?.fullName?.toLowerCase() || '';
//     const email = enrollment.student?.email?.toLowerCase() || '';
//     const courseTitle = enrollment.courseId?.title?.toLowerCase() || '';
//     const status = enrollment.status?.toLowerCase() || '';
//     const createdAt = enrollment.createdAt ? new Date(enrollment.createdAt) : null;

//     // Search filter
//     const matchesSearch =
//       studentName.includes(searchTerm.toLowerCase()) ||
//       email.includes(searchTerm.toLowerCase()) ||
//       courseTitle.includes(searchTerm.toLowerCase());

//     // Status filter
//     const matchesStatus = statusFilter ? status === statusFilter.toLowerCase() : true;

//     // Date range filter
//     const matchesDate = (() => {
//       if (!startDate && !endDate) return true;
//       if (!createdAt) return false;

//       const start = startDate ? new Date(startDate + 'T00:00:00') : null;
//       const end = endDate ? new Date(endDate + 'T23:59:59') : null;

//       if (start && end) return createdAt >= start && createdAt <= end;
//       if (start) return createdAt >= start;
//       if (end) return createdAt <= end;
//       return true;
//     })();

//     return matchesSearch && matchesStatus && matchesDate;
//   });

//   const clearFilters = () => {
//     setSearchTerm('');
//     setStatusFilter('');
//     setStartDate('');
//     setEndDate('');
//   };

//   if (loading) return <div className="p-4">Loading enrollments...</div>;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-bold mb-6 text-gray-800">All Enrollments</h2>

//       {/* Filters Section */}
//       <div className="bg-white shadow-md p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center">
//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search by name, email, or course"
//           className="px-4 py-2 border rounded-lg flex-1 min-w-[250px]"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         {/* Status Filter */}
//         <select
//           className="px-4 py-2 border rounded-lg"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="active">Active</option>
//           <option value="completed">Completed</option>
//           <option value="pending">Pending</option>
//         </select>

//         {/* Date Range */}
//         <div className="flex items-center gap-2">
//           <label className="text-gray-600">From:</label>
//           <input
//             type="date"
//             className="px-3 py-2 border rounded-lg"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <label className="text-gray-600">To:</label>
//           <input
//             type="date"
//             className="px-3 py-2 border rounded-lg"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>

//         {/* Clear Filters */}
//         <button
//           className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//           onClick={clearFilters}
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//         <table className="w-full border border-gray-200 rounded-md">
//           <thead className="bg-gray-100 border-b border-gray-200">
//             <tr>
//               <th className="py-3 px-4 text-left">Student Name</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-left">Course</th>
//               <th className="py-3 px-4 text-left">Status</th>
//               <th className="py-3 px-4 text-left">Enrolled On</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEnrollments.length > 0 ? (
//               filteredEnrollments.map((enrollment) => (
//                 <tr key={enrollment._id} className="border-b hover:bg-gray-50">
//                   <td className="py-2 px-4">{enrollment.student?.fullName || 'N/A'}</td>
//                   <td className="py-2 px-4">{enrollment.student?.email || 'N/A'}</td>
//                   <td className="py-2 px-4">{enrollment.courseId?.title || 'N/A'}</td>
//                   <td
//                     className={`py-2 px-4 capitalize font-medium ${
//                       enrollment.status === 'active'
//                         ? 'text-green-600'
//                         : enrollment.status === 'completed'
//                         ? 'text-blue-600'
//                         : 'text-yellow-600'
//                     }`}
//                   >
//                     {enrollment.status || 'N/A'}
//                   </td>
//                   <td className="py-2 px-4">
//                     {formatDateTime(
//                       enrollment.createdAt || enrollment.enrolledAt || enrollment.date
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="py-4 text-center text-gray-500">
//                   No enrollments found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EnrollmentList;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading enrollments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Enrollment Management
          </h1>
          <p className="text-gray-600 text-lg">Monitor and manage all student enrollments</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Total Enrollments: {enrollments.length}</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Filtered: {filteredEnrollments.length}</span>
            </span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
            </svg>
            Filters & Search
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Name, email, or course..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                className="w-full px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="py-4 px-6 text-left font-semibold">Student Details</th>
                  <th className="py-4 px-6 text-left font-semibold">Course Information</th>
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                  <th className="py-4 px-6 text-left font-semibold">Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enrollment, index) => (
                    <tr 
                      key={enrollment._id} 
                      className={`border-b border-gray-100 hover:bg-blue-50/50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'
                      }`}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {(enrollment.student?.fullName || 'N').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {enrollment.student?.fullName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {enrollment.student?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="font-medium text-gray-900">
                          {enrollment.courseId?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            enrollment.status === 'active'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : enrollment.status === 'completed'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}
                        >
                          <div 
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              enrollment.status === 'active'
                                ? 'bg-green-500'
                                : enrollment.status === 'completed'
                                ? 'bg-blue-500'
                                : 'bg-yellow-500'
                            }`}
                          ></div>
                          {enrollment.status ? enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="text-gray-900 font-medium">
                          {formatDateTime(
                            enrollment.createdAt || enrollment.enrolledAt || enrollment.date
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">No enrollments found</h3>
                          <p className="text-gray-500 mt-1">Try adjusting your filters or search criteria</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        {filteredEnrollments.length > 0 && (
          <div className="mt-6 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center text-gray-600">
            Showing {filteredEnrollments.length} of {enrollments.length} total enrollments
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentList;