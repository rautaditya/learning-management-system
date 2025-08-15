// src/components/ContactForm.jsx
import React, { useState } from 'react';
import { submitContactForm } from '../../api/common';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Technical Support',
    subject: '',
    message: '',
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await submitContactForm(formData);
      setSuccessMsg(res.message);
      setFormData({
        name: '',
        email: '',
        department: 'Technical Support',
        subject: '',
        message: '',
      });
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Contact Us</h2>

      {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
      {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="Technical Support">Technical Support</option>
          <option value="Sales">Sales</option>
          <option value="Billing">Billing</option>
        </select>
        <input
          type="text"
          name="subject"
          placeholder="What is this regarding?"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <textarea
          name="message"
          placeholder="Let us know how we can help you..."
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;
