import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  BookOpen,
  Users,
  FileSpreadsheet,
  Video,
  MessageSquare,
  BarChart3,
  Award,
  UserCheck,
  FileBarChart,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [activePath, setActivePath] = useState('/admin/dashboard');
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    {
      label: 'Courses',
      icon: <BookOpen size={20} />,
      children: [
        { path: '/admin/courses/add', label: 'AddCourse' },
        { path: '/admin/courses/manage', label: 'ManageCourse' },
        { path: '/admin/enrolledcourses', label: 'Enrolled Courses' },
        { path: '/admin/course-category', label: 'Categories' }
      ]
    },

    {
      label: 'Assignment',
      icon: <BookOpen size={20} />,
      children: [
        { path: '/admin/addassignment', label: 'AddAssignment' },
        { path: '/admin/manageassignment', label: 'ManageAssignment' }
      ]
    },

    {
      label: 'Video',
      icon: <BookOpen size={20} />,
      children: [
        { path: '/admin/videosection', label: 'AddVideo' },
        { path: '/admin/ManageVideo', label: 'ManageVideo' }
      ]
    },

    {
      label: 'Study Material',
      icon: <FileSpreadsheet size={20} />,
      children: [
        { path: 'studymaterial/add', label: 'AddMaterial' },
        { path: 'studymaterial/manage', label: 'ManageMaterial' }
      ]
    },

    {
      label: 'Exam',
      icon: <BookOpen size={20} />,
      children: [
        { path: '/admin/createexam', label: 'CreateExam' },
        { path: '/admin/manageexam', label: 'ManageExam' }
      ]
    },

    { path: '/admin/users', icon: <Users size={20} />, label: 'Manage Users' },
    { path: '/admin/enrollments', icon: <MessageSquare size={20} />, label: 'Enrollment Logs' },
    { path: '/admin/discussion', icon: <MessageSquare size={20} />, label: 'Discussion' },
    { path: '/admin/studentprogress', icon: <BarChart3 size={20} />, label: 'Student Progress' },
    { path: '/admin/certificates', icon: <Award size={20} />, label: 'Certificates' },
    { path: '/admin/instructors', icon: <UserCheck size={20} />, label: 'Instructors' },
    { path: '/admin/reports', icon: <FileBarChart size={20} />, label: 'Reports' },
    { path: '/admin/contactdata', icon: <MessageSquare size={20} />, label: 'Contact Data' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
    { path: '/logout', icon: <LogOut size={20} />, label: 'Logout', className: 'mt-6 text-red-500' }
  ];

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };
//lms

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      <aside className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 h-screen bg-gray-900 text-gray-300 fixed left-0 top-0 shadow-xl flex flex-col z-10`}>
        <div className="py-6 px-4 border-b border-gray-800 flex items-center justify-between">
          {!collapsed && (
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Vivaaks LMS
            </h3>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index} className={item.className}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        openDropdown === item.label ? 'bg-gray-800' : 'hover:bg-gray-800'
                      }`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="text-sm font-medium">{item.label}</span>
                          <ChevronRight size={16} className={`transition-transform ${openDropdown === item.label ? 'rotate-90' : ''}`} />
                        </>
                      )}
                    </button>

                    {openDropdown === item.label && !collapsed && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <button
                              onClick={() => handleNavigation(subItem.path)}
                              className={`w-full flex items-center p-2 rounded-md text-sm font-medium transition ${
                                activePath === subItem.path ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                              }`}
                            >
                              {subItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activePath === item.path ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
                    } ${item.className ? 'text-red-400 hover:text-red-300' : ''}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
