// src/components/CourseDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../api/superadmin';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError('Failed to load course.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!course) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{course.title}</h2>

      {course.courseImage && (
        <img
          src={`http://localhost:5000/${course.courseImage.replace(/\\/g, '/')}`}
          alt={course.title}
          className="w-64 h-64 object-cover mb-4 rounded"
        />
      )}

      <div className="space-y-2 text-lg">
        <p><strong>Description:</strong> {course.description}</p>
        <p><strong>Category:</strong> {course.category}</p>
        <p><strong>Instructor:</strong> {course.instructor}</p>
        <p><strong>Language:</strong> {course.language}</p>
        <p><strong>Duration:</strong> {course.duration}</p>
        <p><strong>Level:</strong> {course.level}</p>
        <p><strong>Price Type:</strong> {course.priceType}</p>
        {course.priceType === 'Paid' && (
          <p><strong>Price:</strong> ₹{course.price}</p>
        )}
        <p><strong>Prerequisites:</strong> {course.prerequisites}</p>
        <p><strong>Certification:</strong> {course.certification}</p>
        <p><strong>Status:</strong> {course.approved ? 'Approved' : course.approved === false ? 'Unapproved' : 'Pending'}</p>
      </div>

      {course.syllabus && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-2">Syllabus</h3>
          <p>{course.syllabus}</p>
        </div>
      )}

      {course.videos && course.videos.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Course Videos</h3>
          <div className="space-y-6">
            {course.videos.map((video, index) => (
              <div key={index} className="border p-4 rounded shadow-sm bg-gray-50">
                <h4 className="text-xl font-bold mb-2">{video.title}</h4>
                <p><strong>Description:</strong> {video.description || 'N/A'}</p>
                <p><strong>Duration:</strong> {video.duration || 'N/A'}</p>
                <p><strong>Uploaded By:</strong> {video.uploadedBy?.name || 'Unknown'}</p>
                <p><strong>Uploaded At:</strong> {new Date(video.createdAt).toLocaleString()}</p>
                <video
                  controls
                  src={`http://localhost:5000/${video.videoPath.replace(/\\/g, '/')}`}
                  className="w-full mt-3 rounded"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
