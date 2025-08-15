



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

  if (loading) return <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">Loading course content...</div>;

  if (!course) return <div className="flex items-center justify-center min-h-screen text-lg text-red-600">Course not found or an error occurred.</div>;

  const completedVideosCount = course.videos.filter((v) => v.completed).length;
  const totalVideos = course.videos.length;
  const completedExams = course.exams?.filter((e) => e.submitted).length || 0;
  const totalExams = course.exams?.length || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
        >
          ← Back to Courses
        </button>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Current Progress: {course.progress || 0}%</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${course.progress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            OVERVIEW
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'videos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            VIDEOS ({totalVideos})
          </button>
          <button 
            onClick={() => setActiveTab('exams')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'exams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            EXAMS ({totalExams})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Video Progress</h3>
              <p className="text-2xl font-bold text-blue-700">{completedVideosCount}/{totalVideos}</p>
              <p className="text-sm text-blue-600">Videos Completed</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Exam Progress</h3>
              <p className="text-2xl font-bold text-green-700">{completedExams}/{totalExams}</p>
              <p className="text-sm text-green-600">Exams Completed</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="space-y-6">
          {course.videos.length > 0 ? (
            course.videos.map((video, idx) => (
              <div key={video._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">
                      Lesson {idx + 1}: {video.title}
                    </h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      video.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {video.completed ? 'Watched ✅' : 'Not Watched ⏳'}
                    </span>
                  </div>
                  
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      controls
                      className="w-full h-full"
                      onEnded={() => handleVideoEnd(video._id, video.title)}
                    >
                      <source src={`http://localhost:5000/${video.videoPath?.replace(/\\/g, '/')}`} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No videos available.</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="space-y-6">
          {course.exams?.length > 0 ? (
            course.exams.map((exam) => (
              <div key={exam._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{exam.title}</h4>
                    <p className="text-gray-600">{exam.description}</p>
                  </div>
                  <div className="ml-4">
                    {exam.submitted ? (
                      <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                        ✅ Completed
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleExamCompletion(exam._id, exam.title)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                      >
                        Take Exam (Simulate)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No exams available.</div>
            </div>
          )}
        </div>
      )}

      {/* Message Toast */}
      {showMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;