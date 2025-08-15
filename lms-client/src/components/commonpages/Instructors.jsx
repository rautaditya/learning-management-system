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
        <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2>{isEditing ? 'Edit Instructor' : 'Add Instructor'}</h2>

            {message && (
                <div style={{
                    padding: '10px',
                    background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: message.type === 'success' ? '#155724' : '#721c24',
                    marginBottom: '10px',
                    borderRadius: '5px'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Department</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: isEditing ? '#28a745' : '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Instructor' : 'Add Instructor')}
                </button>
            </form>

            {/* Instructor List */}
            <div style={{ marginTop: '30px' }}>
                <h3>Instructor List</h3>
                {loadingInstructors ? (
                    <p>Loading instructors...</p>
                ) : instructors.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Full Name</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Department</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructors.map((inst) => (
                                <tr key={inst._id}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{inst.fullName}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{inst.email}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{inst.department}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <button
                                            onClick={() => handleEdit(inst)}
                                            style={{ marginRight: '5px', padding: '5px 10px', background: '#ffc107', border: 'none', cursor: 'pointer' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(inst._id)}
                                            style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No instructors found.</p>
                )}
            </div>
        </div>
    );
};

export default AddInstructor;
