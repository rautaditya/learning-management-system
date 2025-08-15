import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCourseById,
  getCourseProgress,
  markVideoCompleted,
  markExamCompleted,
} from '../../api/student';

const Classroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const showCustomMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage('');
    }, 3000);
  };

  const reloadCourseProgress = async (baseCourseData) => {
    try {
      const progressResponse = await getCourseProgress(id);
      const progressData = progressResponse?.data || {};

      const completedVideoIds = (progressData.completedVideos || []).map(v => v.toString());
      const completedExamIds = (progressData.completedExams || []).map(v => v.toString());
      const progressValue = progressData.progress || 0;

      const updatedVideos = baseCourseData.videos.map((video) => ({
        ...video,
        completed: completedVideoIds.includes(video._id?.toString()),
      }));

      const updatedExams = baseCourseData.exams
        ? baseCourseData.exams.map((exam) => ({
            ...exam,
            submitted: completedExamIds.includes(exam._id?.toString()),
          }))
        : [];

      setCourse({
        ...baseCourseData,
        videos: updatedVideos,
        exams: updatedExams,
        progress: progressValue,
      });
    } catch (error) {
      console.error('Error loading progress:', error);
      showCustomMessage('Failed to load progress');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourseById(id);
        await reloadCourseProgress(courseData);
      } catch (error) {
        console.error('Error loading course:', error);
        showCustomMessage('Error loading course content.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleVideoEnd = async (videoId, title) => {
    try {
      await markVideoCompleted(id, videoId);
      const updatedCourse = await getCourseById(id);
      await reloadCourseProgress(updatedCourse);
      showCustomMessage(`"${title}" marked as completed`);
    } catch (err) {
      console.error('Error marking video complete:', err);
      showCustomMessage('Failed to mark video as completed');
    }
  };

  const handleExamCompletion = async (examId, title) => {
    try {
      await markExamCompleted(id, examId);
      const updatedCourse = await getCourseById(id);
      await reloadCourseProgress(updatedCourse);
      showCustomMessage(`"${title}" exam marked as completed`);
    } catch (err) {
      console.error('Error marking exam complete:', err);
      showCustomMessage('Failed to mark exam as completed');
    }
  };

  if (loading) return <p>Loading course content...</p>;

  if (!course) return <p>Course not found or an error occurred.</p>;

  const completedVideosCount = course.videos.filter((v) => v.completed).length;
  const totalVideos = course.videos.length;
  const completedExams = course.exams?.filter((e) => e.submitted).length || 0;
  const totalExams = course.exams?.length || 0;

  return (
    <div>
      <button onClick={() => navigate('/')}>← Back to Courses</button>
      <h2>{course.title}</h2>
      <p>Current Progress: {course.progress || 0}%</p>
      <progress value={course.progress || 0} max="100" />

      <div>
        <button onClick={() => setActiveTab('overview')}>OVERVIEW</button>
        <button onClick={() => setActiveTab('videos')}>VIDEOS ({totalVideos})</button>
        <button onClick={() => setActiveTab('exams')}>EXAMS ({totalExams})</button>
      </div>

      {activeTab === 'overview' && (
        <div>
          <p>Videos Completed: {completedVideosCount}/{totalVideos}</p>
          <p>Exams Completed: {completedExams}/{totalExams}</p>
        </div>
      )}

      {activeTab === 'videos' && (
        <div>
          {course.videos.length > 0 ? (
            course.videos.map((video, idx) => (
              <div key={video._id}>
                <h4>Lesson {idx + 1}: {video.title}</h4>
                <video
                  controls
                  width="100%"
                  onEnded={() => handleVideoEnd(video._id, video.title)}
                >
                  <source src={`http://localhost:5000/${video.videoPath?.replace(/\\/g, '/')}`} type="video/mp4" />
                </video>
                <p>Status: {video.completed ? 'Watched ✅' : 'Not Watched ⏳'}</p>
              </div>
            ))
          ) : (
            <p>No videos available.</p>
          )}
        </div>
      )}

      {activeTab === 'exams' && (
        <div>
          {course.exams?.length > 0 ? (
            course.exams.map((exam) => (
              <div key={exam._id}>
                <h4>{exam.title}</h4>
                <p>{exam.description}</p>
                {exam.submitted ? (
                  <p>✅ Completed</p>
                ) : (
                  <button onClick={() => handleExamCompletion(exam._id, exam.title)}>
                    Take Exam (Simulate)
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No exams available.</p>
          )}
        </div>
      )}

      {showMessage && <div>{message}</div>}
    </div>
  );
};

export default Classroom;
