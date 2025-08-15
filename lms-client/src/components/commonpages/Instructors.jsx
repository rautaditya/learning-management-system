import React, { useState, useEffect } from 'react';
import {
    addInstructor,
    getInstructors,
    updateInstructor,
    deleteInstructor
} from '../../api/common';

const AddInstructor = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        department: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [instructors, setInstructors] = useState([]);
    const [loadingInstructors, setLoadingInstructors] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Fetch instructors on page load
    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            setLoadingInstructors(true);
            const data = await getInstructors();
            setInstructors(data.data || []);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        } finally {
            setLoadingInstructors(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isEditing) {
                // Update Instructor
                const data = await updateInstructor(editId, formData);
                setMessage({ type: 'success', text: data.message });
                setIsEditing(false);
                setEditId(null);
            } else {
                // Add Instructor
                const data = await addInstructor(formData);
                setMessage({ type: 'success', text: data.message });
            }

            setFormData({ fullName: '', email: '', department: '' });
            fetchInstructors(); // refresh table
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Something went wrong'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (instructor) => {
        setFormData({
            fullName: instructor.fullName,
            email: instructor.email,
            department: instructor.department
        });
        setIsEditing(true);
        setEditId(instructor._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this instructor?')) return;
        try {
            const data = await deleteInstructor(id);
            setMessage({ type: 'success', text: data.message });
            fetchInstructors();
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to delete instructor'
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-12 p-5 border border-gray-300 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
                {isEditing ? 'Edit Instructor' : 'Add Instructor'}
            </h2>

            {message && (
                <div className={`p-3 mb-3 rounded ${
                    message.type === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                    </label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 text-white font-medium rounded-md transition-colors duration-200 ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : isEditing 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading 
                        ? (isEditing ? 'Updating...' : 'Adding...') 
                        : (isEditing ? 'Update Instructor' : 'Add Instructor')
                    }
                </button>
            </form>

            {/* Instructor List */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Instructor List</h3>
                {loadingInstructors ? (
                    <p className="text-gray-600">Loading instructors...</p>
                ) : instructors.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                                        Full Name
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                                        Email
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                                        Department
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {instructors.map((inst) => (
                                    <tr key={inst._id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">
                                            {inst.fullName}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {inst.email}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {inst.department}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                onClick={() => handleEdit(inst)}
                                                className="mr-2 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(inst._id)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors duration-200"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">No instructors found.</p>
                )}
            </div>
        </div>
    );
};

export default AddInstructor;