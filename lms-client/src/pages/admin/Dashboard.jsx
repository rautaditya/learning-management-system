import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/common';
import { LoaderCircle, Users, BookOpen, Video, FileText, MessageSquare, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <LoaderCircle className="animate-spin w-12 h-12 text-blue-600" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-blue-200 rounded-full animate-ping"></div>
          </div>
          <p className="text-slate-600 font-medium animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-pulse animation-delay-2s"></div>
      </div>

      <div className="relative p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h2>
          <p className="text-slate-600">Welcome back! Here's your system overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            label="Total Students"
            value={stats.totalStudents}
            icon={Users}
            gradient="from-blue-500 to-blue-600"
            bgGradient="from-blue-50 to-blue-100"
            onClick={() => navigate('/admin/users')}
            delay="animate-slide-up-1"
          />
          <DashboardCard
            label="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            gradient="from-emerald-500 to-emerald-600"
            bgGradient="from-emerald-50 to-emerald-100"
            onClick={() => navigate('/admin/courses/manage')}
            delay="animate-slide-up-2"
          />
          <DashboardCard
            label="Total Videos"
            value={stats.totalVideos}
            icon={Video}
            gradient="from-purple-500 to-purple-600"
            bgGradient="from-purple-50 to-purple-100"
            onClick={() => navigate('/admin/managevideo')}
            delay="animate-slide-up-3"
          />
          <DashboardCard
            label="Total Assignments"
            value={stats.totalAssignments}
            icon={FileText}
            gradient="from-orange-500 to-orange-600"
            bgGradient="from-orange-50 to-orange-100"
            onClick={() => navigate('/admin/manageassignment')}
            delay="animate-slide-up-4"
          />
          <DashboardCard
            label="Contact Messages"
            value={stats.totalMessages}
            icon={MessageSquare}
            gradient="from-pink-500 to-pink-600"
            bgGradient="from-pink-50 to-pink-100"
            onClick={() => navigate('/admin/contactdata')}
            delay="animate-slide-up-5"
          />
          <DashboardCard
            label="Total Exams"
            value={stats.totalExams}
            icon={GraduationCap}
            gradient="from-indigo-500 to-indigo-600"
            bgGradient="from-indigo-50 to-indigo-100"
            delay="animate-slide-up-6"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up-1 { animation: slide-up 0.6s ease-out 0.1s both; }
        .animate-slide-up-2 { animation: slide-up 0.6s ease-out 0.2s both; }
        .animate-slide-up-3 { animation: slide-up 0.6s ease-out 0.3s both; }
        .animate-slide-up-4 { animation: slide-up 0.6s ease-out 0.4s both; }
        .animate-slide-up-5 { animation: slide-up 0.6s ease-out 0.5s both; }
        .animate-slide-up-6 { animation: slide-up 0.6s ease-out 0.6s both; }
        .animation-delay-2s { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

const DashboardCard = ({ label, value, icon: Icon, gradient, bgGradient, onClick, delay }) => (
  <div className={`${delay} transform transition-all duration-500 hover:scale-105`}>
    <div
      onClick={onClick}
      className={`relative group bg-gradient-to-br ${bgGradient} backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/50 overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-2xl' : ''
      } transition-all duration-300`}
    >
      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors duration-300"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg group-hover:bg-white/20 transition-colors duration-300"></div>
      
      <div className="relative z-10">
        {/* Icon */}
        <div className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">{label}</p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value?.toLocaleString() || '0'}
          </p>
        </div>
        
        {/* Click indicator */}
        {onClick && (
          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center text-sm text-slate-500 font-medium">
              <span>Click to manage</span>
              <div className="ml-2 w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default Dashboard;