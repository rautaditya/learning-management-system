import React, { useEffect, useState } from 'react';
import { getMyLearning } from '../../api/student';
import { useNavigate } from 'react-router-dom';

const MyLearning = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchEnrolledCourses = async () => {
    try {
      const data = await getMyLearning();
      console.log("Fetched courses:", data); // 👀 Check structure
      setCourses(data);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchEnrolledCourses();
}, []);


  if (loading) return <div className="p-10 text-center text-xl font-semibold">Loading...</div>;

  if (courses.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-4">You haven't enrolled in any courses yet.</h2>
        <button
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow"
          onClick={() => navigate('/courses')}
        >
          Browse Courses
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Learning</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {courses
  .filter(course => course !== null) // 🚫 Skip null
  .map(course => (
    <div key={course._id} className="bg-white rounded-xl shadow p-4 border hover:shadow-md transition">
      <img
        src={
          course.courseImage
            ? `http://localhost:5000/${course.courseImage.replace(/\\/g, '/')}`
            : '/default-course.jpg' // 👈 fallback if no image
        }
        alt={course.title}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />
      <h2 className="text-xl font-bold">{course.title}</h2>
      <p className="text-gray-600 mb-2">{course.instructor}</p>
      <p className="text-sm text-gray-500 mb-4">{course.description.slice(0, 80)}...</p>
      <button
        onClick={() => navigate(`/course/${course._id}`)}
        className="text-blue-600 font-medium"
      >
        Go to Course →
      </button>
    </div>
))}

      </div>
    </div>
  );
};

export default MyLearning;
