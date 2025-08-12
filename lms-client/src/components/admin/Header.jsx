import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search,
  User,
  ChevronDown,
  MessageSquare,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminProfile from '../../pages/admin/AdminProfile';

const Header = ({ collapsed, setCollapsed }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false); // ✅ Profile popup state
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/adminsuperadmin/login');
  };

  const notifications = [
    { id: 1, text: 'New student enrolled in Advanced Python', time: '10 min ago', read: false },
    { id: 2, text: 'Assignment deadline updated for Web Dev course', time: '1 hour ago', read: false },
    { id: 3, text: 'New instructor application received', time: '3 hours ago', read: true },
    { id: 4, text: 'System maintenance scheduled for tonight', time: 'Yesterday', read: true }
  ];

  return (
    <>
      <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 fixed top-0 right-0 left-0 z-10 ml-64 transition-all duration-300" style={{ marginLeft: collapsed ? '5rem' : '16rem' }}>
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-2 rounded-full hover:bg-gray-100 lg:hidden transition-all duration-200"
          >
            <Menu size={20} />
          </button>

          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search courses, students, or reports..." 
              className="bg-gray-100 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all duration-200"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hidden sm:flex">
            <HelpCircle size={20} />
          </button>

          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-20">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-xs text-blue-500 hover:text-blue-700">Mark all as read</button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-500 mt-1">
                          <MessageSquare size={16} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-blue-500 hover:text-blue-700 w-full text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 hover:bg-gray-100 rounded-full pl-2 pr-3 py-1 transition-all duration-200"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="text-sm font-medium hidden md:block">Admin User</span>
              <ChevronDown size={16} className="text-gray-500 hidden md:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-20">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@vivaaks.com</p>
                </div>

                {/* Show popup from here */}
                <button 
                  onClick={() => {
                    setShowAdminProfile(true);
                    setShowProfileMenu(false); // close dropdown
                  }}
                  className="w-full  text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>

                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings size={16} />
                  <span>Settings</span>
                </a>

                <div className="border-t border-gray-100 my-1"></div>

                <button 
                  onClick={handleLogout} 
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ Admin Profile Popup */}
      {showAdminProfile && (
        <AdminProfile onClose={() => setShowAdminProfile(false)} />
      )}
    </>
  );
};

export default Header;

