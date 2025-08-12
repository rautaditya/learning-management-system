import React, { useEffect, useState } from 'react';
import { getAllStudents, updateStudent, deleteStudent } from '../../api/common';
import {
  BadgeAlert,
  Pencil,
  Trash2,
  BarChart2,
  CalendarDays,
  Search,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444'];

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      if (res?.data && Array.isArray(res.data)) {
        setStudents(res.data);
        setFilteredStudents(res.data);
      } else {
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = [...students];

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((s) =>
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (s) => s.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (s) => new Date(s.joiningDate) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (s) => new Date(s.joiningDate) <= new Date(endDate)
      );
    }

    setFilteredStudents(filtered);
  }, [searchTerm, statusFilter, startDate, endDate, students]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        setStudents((prev) => prev.filter((student) => student._id !== id));
      } catch (err) {
        alert('Failed to delete student: ' + err.message);
      }
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent({ _id: student._id, status: student.status });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await updateStudent(selectedStudent._id, { status: selectedStudent.status });
      setStudents((prev) =>
        prev.map((s) =>
          s._id === selectedStudent._id ? { ...s, status: selectedStudent.status } : s
        )
      );
      setShowModal(false);
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  const chartData = [
    {
      name: 'Active',
      value: filteredStudents.filter((s) => s.status?.toLowerCase() === 'active').length,
    },
    {
      name: 'Inactive',
      value: filteredStudents.filter((s) => s.status?.toLowerCase() === 'inactive').length,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-800">👨‍🎓 Manage Students</h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2 shadow-sm">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search name/email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 md:w-70 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-3 py-2 shadow-sm text-gray-700"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-xl px-3 py-2 shadow-sm text-gray-700"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-xl px-3 py-2 shadow-sm text-gray-700"
          />

          <button
            onClick={() => setShowGraph(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow"
          >
            <BarChart2 size={18} />
            View Stats
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-blue-500">Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <p className="text-gray-500 italic">No students found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-200"
            >
              <div className="mb-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {student.fullName || 'Unnamed'}
                </h2>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {student.email || 'Not Provided'}
                </p>
                <p className="text-sm flex items-center gap-2 text-gray-600">
                  <BadgeAlert size={16} />
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      student.status?.toLowerCase() === 'active'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {student.status || 'Unknown'}
                  </span>
                </p>
                {student.joiningDate && (
                  <p className="text-sm flex items-center gap-2 text-gray-600">
                    <CalendarDays size={16} />
                    <strong>Joined:</strong>{' '}
                    <span className="font-medium">
                      {new Date(student.joiningDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(student)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Update Status</h2>
            <div className="space-y-4">
              <label className="block text-gray-700 font-medium">Status</label>
              <select
                name="status"
                value={selectedStudent.status}
                onChange={(e) =>
                  setSelectedStudent((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showGraph && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Student Status Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGraph(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
