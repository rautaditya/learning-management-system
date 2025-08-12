import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  LayoutDashboard, UserCog, BookOpen, Building, FileBarChart,
  Settings, LogOut, ShieldPlus, Users, ClipboardList, Film
} from 'lucide-react';

const SuperadminSidebar = ({ collapsed, setCollapsed }) => {
  const [activePath, setActivePath] = useState('/superadmin/dashboard');
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/superadmin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    {
      label: 'Admin',
      icon: <ShieldPlus size={20} />, // Admin icon
      children: [
        { path: '/superadmin/AddAdmin', label: 'Add Admin' },
        { path: '/superadmin/admins', label: 'Manage Admin' },
      ]
    },
    {
      label: 'Courses',
      icon: <BookOpen size={20} />, // Course icon
      children: [
        { path: '/superadmin/courses/add', label: 'Add Courses' },
        { path: '/superadmin/courses/manage', label: 'Manage Course' },
      ]
    },
    {
      label: 'Assignment',
      icon: <ClipboardList size={20} />, // Assignment icon
      children: [
        { path: '/superadmin/AddAssignment', label: 'Add Assignment' },
        { path: '/superadmin/assignment', label: 'Manage Assignment' },
      ]
    },
    { path: '/superadmin/users', icon: <Users size={20} />, label: 'Manage Users' },
    { path: '/superadmin/enrollments', icon: <ClipboardList size={20} />, label: 'Enrollment Logs' },
    {
      label: 'Video',
      icon: <Film size={20} />, // Video icon
      children: [
        { path: '/superadmin/AddVideo', label: 'Add Video' },
        { path: '/superadmin/ManageVideo', label: 'Manage Video' },
      ]
    },
    { path: '/superadmin/institutes', icon: <Building size={20} />, label: 'Institutes' },
    { path: '/superadmin/contactdata', icon: <UserCog size={20} />, label: 'Contact Data' },
    { path: '/superadmin/reports', icon: <FileBarChart size={20} />, label: 'Reports' },
    { path: '/superadmin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 h-screen bg-gray-900 text-gray-300 fixed left-0 top-0 shadow-xl flex flex-col z-10`}>
      <div className="py-6 px-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && <h3 className="text-xl font-bold text-purple-400">Super Admin</h3>}
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
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg transition-all ${
                      openDropdown === item.label ? ' text-white' : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </div>
                    {!collapsed && (openDropdown === item.label ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </button>
                  {openDropdown === item.label && !collapsed && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <button
                            onClick={() => handleNavigation(child.path)}
                            className={`w-full text-left flex items-center p-2 rounded-md text-sm ${
                              activePath === child.path ? 'bg-purple-700 text-white' : 'hover:bg-gray-800'
                            }`}
                          >
                            {child.label}
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
                    activePath === item.path ? 'bg-purple-600 text-white' : 'hover:bg-gray-800'
                  } ${item.className ?? ''}`}
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
  );
};

export default SuperadminSidebar;
