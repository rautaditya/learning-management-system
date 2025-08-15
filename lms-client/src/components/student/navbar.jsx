import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Menu, X, Home, Info, Book, Award, MessageSquare, LogIn,
  GraduationCap, FileText, ClipboardList, ListChecks, User, Settings, LogOut
} from 'lucide-react';
import Profile from '../../pages/student/Profile';
import Mypurchase from '../../pages/student/Mypurchase';

export default function Navbar({ onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPurchases, setShowPurchases] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const checkAuth = () => {
      const storedToken = localStorage.getItem('student_token');
      const userData = localStorage.getItem('student_user');
      const role = localStorage.getItem('student_role');

      if (storedToken && userData && role === 'student') {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        setToken(storedToken);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', checkAuth);
    setActiveItem(window.location.pathname);
    checkAuth();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_role');
    localStorage.removeItem('student_user');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    window.location.href = '/';
  };

  const updateAuthState = () => {
    const storedToken = localStorage.getItem('student_token');
    const userData = localStorage.getItem('student_user');
    const role = localStorage.getItem('student_role');

    if (storedToken && userData && role === 'student') {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setToken(storedToken);
    }
  };

  const publicLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-1" /> },
    { name: 'About Us', path: '/aboutus', icon: <Info className="w-4 h-4 mr-1" /> },
    { name: 'Courses', path: '/courses', icon: <Book className="w-4 h-4 mr-1" /> },
    { name: 'Achievements', path: '/achievements', icon: <Award className="w-4 h-4 mr-1" /> },
    { name: 'Contact', path: '/contact', icon: <MessageSquare className="w-4 h-4 mr-1" /> },
  ];

  const studentLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-1" /> },
    { name: 'Courses', path: '/courses', icon: <Book className="w-4 h-4 mr-1" /> },
    { name: 'My Learning', path: '/learning', icon: <GraduationCap className="w-4 h-4 mr-1" /> },
    { name: 'Study Material', path: '/studymaterials', icon: <FileText className="w-4 h-4 mr-1" /> },
    { name: 'Assignments', path: '/assignments', icon: <ClipboardList className="w-4 h-4 mr-1" /> },
    { name: 'Exam', path: '/exam', icon: <ListChecks className="w-4 h-4 mr-1" /> },
  ];

  return (
    <>
      <nav className={`fixed w-full z-30 top-0 left-0 transition-all duration-300 ease-in-out ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white/80 py-4'
      }`}>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold whitespace-nowrap">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Vivaaks
              </span>
              <span className="text-gray-800 font-normal ml-1">LMS</span>
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center p-2 text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={toggleNavbar}
          >
            {isOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
          </button>

          <div className={`${isOpen ? 'block animate-fadeIn' : 'hidden'} w-full md:block md:w-auto`}>
            <ul className="flex flex-col py-2 md:flex-row md:space-x-1 md:py-0 md:font-medium">
              {(isAuthenticated ? studentLinks : publicLinks).map((item) => (
                <li key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:text-blue-600 hover:bg-blue-50 md:hover:bg-transparent ${
                      activeItem === item.path ? 'text-blue-600' : 'text-gray-700'
                    }`}
                    onClick={() => setActiveItem(item.path)}
                  >
                    {item.icon}
                    {item.name}
                    <span className="absolute bottom-0 left-0 h-0.5 bg-blue-600 w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Link>
                </li>
              ))}

              {isAuthenticated ? (
                <li className="relative">
                  <div
                    className="inline-block"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <button className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                      <User className="w-5 h-5 mr-1" />
                      {user?.fullName || 'My Account'}
                    </button>

                    <div className={`absolute w-44 bg-white shadow-lg rounded-lg z-50 ${showDropdown ? 'block' : 'hidden'}`}>
                      <ul className="text-sm mt-0">
                        <li>
                          <button
                            onClick={() => {
                              setShowProfileModal(true);
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <User className="inline w-4 h-4 mr-1" />
                            Profile
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setShowPurchases(true);
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <Settings className="inline w-4 h-4 mr-1" />
                            My Purchases
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            <LogOut className="inline w-4 h-4 mr-1" />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              ) : (
                <li>
                  <button
                    onClick={() => onLoginClick(updateAuthState)}
                    className="flex items-center px-4 py-2 ml-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className={`${scrolled ? 'h-16' : 'h-20'} transition-all duration-300`}></div>

      {showProfileModal && (
        <Profile user={user} token={token} onClose={() => setShowProfileModal(false)} />
      )}
      {showPurchases && (
        <Mypurchase user={user} token={token} onClose={() => setShowPurchases(false)} />
      )}
    </>
  );
}
