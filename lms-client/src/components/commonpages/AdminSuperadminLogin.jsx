// src/pages/AdminSuperadminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSuperadminLogin } from '../../api/auth';

const AdminSuperadminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await adminSuperadminLogin({ username, password });
    console.log("API response:", response);

    const { token, user } = response.data;

    if (!user || !user.role) {
      throw new Error("Invalid user data");
    }

    // ✅ Clear existing student session before admin login
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_role');
    localStorage.removeItem('student_user');

    // ✅ Set admin session
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_role', user.role);
    localStorage.setItem('admin_user', JSON.stringify(user));

    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user.role === 'superadmin') {
      navigate('/superadmin/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
    setError('Invalid credentials or server error.');
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin/Superadmin Login</h2>

        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded mt-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminSuperadminLogin;
