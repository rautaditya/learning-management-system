import React, { useEffect, useState } from "react";
import { getCourseAnnouncementsForStudent } from "../../api/announcement";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("userId"); // ✅ stored _id
    if (!uid) {
      console.warn("⚠️ No userId in localStorage, skipping API call.");
      setLoading(false);
      return;
    }

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching announcements for user:", uid);

        const data = await getCourseAnnouncementsForStudent(uid);
        console.log("✅ API Response:", data);

        // Handle both possible formats
        if (Array.isArray(data)) {
          setAnnouncements(data);
        } else if (data?.announcements) {
          setAnnouncements(data.announcements);
        } else {
          setAnnouncements([]);
        }
      } catch (err) {
        console.error("❌ Error fetching announcements:", err);
        setError("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading announcements...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📢 Course Announcements</h2>
      {announcements.length === 0 ? (
        <p className="text-gray-600">No announcements available.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((ann, idx) => (
            <li
              key={ann._id || idx}
              className="border p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{ann.title || "Untitled"}</h3>
              <p className="text-gray-700 mt-1">{ann.message || ann.content}</p>
              {ann.course && (
                <p className="text-sm text-gray-500 mt-2">
                  📘 Course: {ann.course.name || ann.course.title || "N/A"}
                </p>
              )}
              <p className="text-sm text-gray-400">
                📅 {ann.createdAt ? new Date(ann.createdAt).toLocaleString() : "N/A"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentAnnouncements;
