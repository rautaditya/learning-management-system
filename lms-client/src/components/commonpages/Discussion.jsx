import React, { useEffect, useState } from 'react';
import {
  sendAnnouncement,
  getAllAdmins,
  getAllSuperAdmins,
  getAllCourses,
  getMyAnnouncements,
  sendReply,
} from '../../api/announcement';

const AnnouncementPage = () => {
  const loggedInUserId = '681d86a55c5b2b92caee9509'; // replace with dynamic logged-in user ID

  const [tab, setTab] = useState('received'); // received, sent-admin, sent-student
  const [admins, setAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [recipientType, setRecipientType] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [error, setError] = useState('');
  const [readAnnouncements, setReadAnnouncements] = useState([]);

  // Fetch all data once
  useEffect(() => {
    getAllAdmins().then(setAdmins).catch(() => setError('Failed to load admins'));
    getAllSuperAdmins().then(setSuperAdmins).catch(() => setError('Failed to load superadmins'));
    getAllCourses().then(setCourses).catch(() => setError('Failed to load courses'));
  }, []);

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getMyAnnouncements({ dateRange: dateFilter });
      setAnnouncements(data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [dateFilter]);

  // Send announcement
  const handleSend = async () => {
    if (!recipientType || !message) {
      alert('Please select recipient type and enter message');
      return;
    }

    try {
      await sendAnnouncement({
        role: recipientType,
        targetId: selectedRecipient,
        message,
        senderId: loggedInUserId,
      });
      setMessage('');
      setSelectedRecipient('');
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  // Send reply
  const handleReply = async (announcementId) => {
    if (!replyText[announcementId]) return;
    try {
      await sendReply({
        announcementId,
        message: replyText[announcementId],
      });
      setReplyText({ ...replyText, [announcementId]: '' });
      fetchAnnouncements();
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  // Mark as read
  const markAsRead = (id) => {
    setReadAnnouncements((prev) => [...prev, id]);
  };

  // Filter announcements for tabs
  const filteredAnnouncements = announcements.filter((a) => {
    const senderId = a.sender?._id?.toString() || a.sender.toString();

    if (tab === 'received') {
      const recipientsIds = a.recipients?.map((r) => r.toString()) || [];
      return recipientsIds.includes(loggedInUserId) && senderId !== loggedInUserId && !readAnnouncements.includes(a._id);
    }

    if (tab === 'sent-admin') {
      return senderId === loggedInUserId && (a.role === 'admin' || a.role === 'superadmin');
    }

    if (tab === 'sent-student') {
      return senderId === loggedInUserId && a.role === 'student';
    }

    return false;
  });

  // Count messages for tabs
  const receivedCount = announcements.filter((a) => {
    const senderId = a.sender?._id?.toString() || a.sender.toString();
    const recipientsIds = a.recipients?.map((r) => r.toString()) || [];
    return recipientsIds.includes(loggedInUserId) && senderId !== loggedInUserId && !readAnnouncements.includes(a._id);
  }).length;

  const sentAdminCount = announcements.filter((a) => {
    const senderId = a.sender?._id?.toString() || a.sender.toString();
    return senderId === loggedInUserId && (a.role === 'admin' || a.role === 'superadmin');
  }).length;

  const sentStudentCount = announcements.filter((a) => {
    const senderId = a.sender?._id?.toString() || a.sender.toString();
    return senderId === loggedInUserId && a.role === 'student';
  }).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header with New Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Announcements</h2>
        {!showForm && (
          <button
            className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm shadow-sm hover:bg-blue-600"
            onClick={() => setShowForm(true)}
          >
            + New
          </button>
        )}
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${tab === 'received' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('received')}
        >
          Received ({receivedCount})
        </button>

        <button
          className={`px-3 py-1 rounded ${tab === 'sent-admin' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('sent-admin')}
        >
          Sent to Admin/Superadmin ({sentAdminCount})
        </button>

        <button
          className={`px-3 py-1 rounded ${tab === 'sent-student' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('sent-student')}
        >
          Sent to Students ({sentStudentCount})
        </button>
      </div>

      {/* New Announcement Form */}
      {showForm && (
        <div className="border p-4 rounded mb-6 bg-gray-50 shadow-sm">
          <h3 className="text-lg font-bold mb-3">Create Announcement</h3>

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

          {recipientType === 'student' && (
            <select
              className="border p-2 w-full mb-3"
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
            >
              <option value="">Select Course</option>
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          )}

          {(recipientType === 'admin' || recipientType === 'superadmin') && (
            <select
              className="border p-2 w-full mb-3"
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
            >
              <option value="">Select {recipientType}</option>
              <option value="all">All {recipientType}s</option>
              {(recipientType === 'admin' ? admins : superAdmins).map((u) => (
                <option key={u._id} value={u._id}>{u.fullName}</option>
              ))}
            </select>
          )}

          <textarea
            className="border p-2 w-full mb-3"
            rows="3"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex gap-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSend}>
              Send
            </button>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Date Filter */}
      <div className="mb-4">
        <select className="border p-2" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Announcement List */}
      {loading ? (
        <p>Loading announcements...</p>
      ) : filteredAnnouncements.length === 0 ? (
        <p>No announcements found</p>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((a) => (
            <div key={a._id} className="border rounded p-4 shadow-sm bg-gray-50">
              <p className="font-medium">{a.message}</p>

              {tab === 'sent-student' && (
                <p className="text-sm text-gray-500">
                  Course: {a.targetId === 'all' ? 'All Courses' : (courses.find(c => c._id === a.targetId)?.title || 'Unknown')}
                </p>
              )}

              <p className="text-xs text-gray-500">
                From: {a.sender?.fullName || 'Unknown'} ({a.sender?.email}) | {a.sender?.role} |{' '}
                {new Date(a.createdAt).toLocaleString()}
              </p>

              {/* Mark as Read */}
              {tab === 'received' && !readAnnouncements.includes(a._id) && (
                <button
                  className="text-blue-600 text-sm mt-2"
                  onClick={() => markAsRead(a._id)}
                >
                  Mark as Read
                </button>
              )}

              {/* Replies */}
              {a.replies?.length > 0 && (
                <div className="mt-3 pl-4 border-l space-y-2">
                  {a.replies.map((r) => (
                    <div key={r._id} className="bg-white p-2 rounded shadow-sm">
                      <p className="text-sm">{r.replyMessage}</p>
                      <p className="text-xs text-gray-500">{r.sender?.fullName} | {new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="flex mt-2 gap-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  className="flex-1 border rounded p-2 text-sm"
                  value={replyText[a._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [a._id]: e.target.value })}
                />
                <button className="bg-blue-500 text-white px-3 rounded text-sm" onClick={() => handleReply(a._id)}>
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementPage;
