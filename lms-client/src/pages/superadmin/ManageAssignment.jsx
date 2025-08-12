// 📁 src/pages/superadmin/ManageAssignment.jsx

import React, { useEffect, useState } from 'react';
import { getAllAssignments, updateAssignment, deleteAssignment } from '../../api/superadmin';
import { Pencil, Trash2, X, FileText } from 'lucide-react';

const ManageAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    file: null,
  });

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await getAllAssignments();
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const openEditModal = (assignment) => {
    setEditForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate?.split('T')[0],
      file: null,
    });
    setEditModal(assignment);
  };

  const handleEditSubmit = async () => {
    try {
      await updateAssignment(editModal._id, editForm);
      setEditModal(null);
      fetchAssignments();
    } catch (err) {
      alert('Failed to update assignment');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAssignment(deleteModal._id);
      setDeleteModal(null);
      fetchAssignments();
    } catch (err) {
      alert('Failed to delete assignment');
    }
  };

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📚 Manage Assignments</h1>

      {loading && <p className="text-blue-500">Loading assignments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="bg-white border rounded-xl shadow-md p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{assignment.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Course:</strong> {assignment.course?.title || 'N/A'}
              </p>
              <p className="text-sm text-gray-700 mb-2">{assignment.description}</p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
              <div className="text-sm text-gray-600 mb-3">
                {assignment.fileUrl ? (
                  <a
                    href={`${apiBaseUrl}${assignment.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <FileText size={16} /> View File
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No File</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openEditModal(assignment)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-1"
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                onClick={() => setDeleteModal(assignment)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-lg relative">
            <button onClick={() => setEditModal(null)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Assignment</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium">Due Date</label>
              <input
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Upload New File (optional)</label>
              <input
                type="file"
                onChange={(e) => setEditForm({ ...editForm, file: e.target.files[0] })}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
            <button
              onClick={handleEditSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center relative">
            <button onClick={() => setDeleteModal(null)} className="absolute top-3 right-3 text-gray-500 hover:text-black">
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Assignment</h2>
            <p className="mb-6">
              Are you sure you want to delete <strong>{deleteModal.title}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Delete
              </button>
              <button onClick={() => setDeleteModal(null)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAssignment;
