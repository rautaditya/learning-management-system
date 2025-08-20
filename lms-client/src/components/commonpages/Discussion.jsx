import React, { useEffect, useState } from 'react';
import {
  sendAnnouncement,
  getAllAdmins,
  getAllSuperAdmins,
  getAllCourses,
  getMyAnnouncements,
} from '../../api/announcement';

const AnnouncementPage = () => {
  const [recipientType, setRecipientType] = useState('');
  const [admins, setAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fetch admins once
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAllAdmins();
        setAdmins(data);
      } catch (err) {
        setError('Failed to load admins');
      }
    };
    fetchAdmins();
  }, []);

  // ✅ Fetch superadmins once
  useEffect(() => {
    const fetchSuperAdmins = async () => {
      try {
        const data = await getAllSuperAdmins();
        setSuperAdmins(data);
      } catch (err) {
        setError('Failed to load superadmins');
      }
    };
    fetchSuperAdmins();
  }, []);

  // ✅ Fetch courses once
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        setError('Failed to load courses');
      }
    };
    fetchCourses();
  }, []);

  // ✅ Fetch announcements (with filter)
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        let filters = {};
        if (dateFilter !== 'all') {
          filters.dateRange = dateFilter;
        }
        const data = await getMyAnnouncements(filters);
        setAnnouncements(data);
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [dateFilter]);

  // ✅ Send announcement
  const handleSend = async () => {
    if (!recipientType || !message) {
      alert('Please select recipient type and enter message');
      return;
    }

    await sendAnnouncement({
      role: recipientType,
      targetId: selectedRecipient,
      message,
      senderId: "66c4f7f2e8a9c31d1c123456" // 👈 replace with logged-in user id
    });

    alert('Announcement sent successfully');
    setMessage('');
    setSelectedRecipient('');
    setDateFilter('all'); // reload all messages
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Send Announcement</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Recipient type dropdown */}
      <select
        className="border p-2 w-full mb-3"
        value={recipientType}
        onChange={(e) => {
          setRecipientType(e.target.value);
          setSelectedRecipient('');
        }}
      >
        <option value="">Select Recipient Type</option>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
        <option value="superadmin">Superadmin</option>
      </select>

      {/* Dynamic dropdown */}
      {recipientType === 'student' && (
        <select
          className="border p-2 w-full mb-3"
          value={selectedRecipient}
          onChange={(e) => setSelectedRecipient(e.target.value)}
        >
          <option value="">Select Course</option>
          <option value="all">All Courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      )}

      {recipientType === 'admin' && (
        <select
          className="border p-2 w-full mb-3"
          value={selectedRecipient}
          onChange={(e) => setSelectedRecipient(e.target.value)}
        >
          <option value="">Select Admin</option>
          <option value="all">All Admins</option>
          {admins.map((a) => (
            <option key={a._id} value={a._id}>
              {a.fullName}
            </option>
          ))}
        </select>
      )}

      {recipientType === 'superadmin' && (
        <select
          className="border p-2 w-full mb-3"
          value={selectedRecipient}
          onChange={(e) => setSelectedRecipient(e.target.value)}
        >
          <option value="">Select Superadmin</option>
          <option value="all">All Superadmins</option>
          {superAdmins.map((s) => (
            <option key={s._id} value={s._id}>
              {s.fullName}
            </option>
          ))}
        </select>
      )}

      {/* Message input */}
      <textarea
        className="border p-2 w-full mb-3"
        rows="3"
        placeholder="Enter announcement message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSend}
      >
        Send
      </button>

      {/* Announcements List */}
      <h3 className="text-lg font-bold mt-8 mb-4">Received Announcements</h3>

      {/* Date Filter */}
      <div className="mb-4">
        <select
          className="border p-2"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Show loading / list */}
      {loading ? (
        <p className="text-gray-500">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p>No announcements found</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div
              key={a._id}
              className="border rounded p-3 shadow-sm bg-gray-50"
            >
              <p className="font-medium">{a.message}</p>
              <p className="text-xs text-gray-500">
                From: {a.sender?.fullName || 'Unknown'} ({a.sender?.email || 'No Email'}) | Date:{' '}
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementPage;
