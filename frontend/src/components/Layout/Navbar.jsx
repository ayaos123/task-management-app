import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaTasks, 
  FaSignOutAlt, 
  FaUser, 
  FaHome,
  FaChartLine,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaChevronDown,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Tasks', icon: <FaTasks /> },
   
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-3 group">
                <div className={`relative ${darkMode ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} p-2 rounded-lg transform group-hover:scale-105 transition-transform duration-200`}>
                  <FaTasks className="w-6 h-6 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300`}>
                    TaskFlow Pro
                  </span>
                  <span className="text-xs text-gray-400">Efficient Task Management</span>
                </div>
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
                    isActive(link.path)
                      ? `${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  <span className={`text-lg ${isActive(link.path) ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`}>
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section - Desktop */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FaSun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <FaMoon className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {/* Notifications */}
              <button 
                className={`relative p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors duration-200`}
                aria-label="Notifications"
              >
                <FaBell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button>

         

              {user ? (
                <>
                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-200 group`}
                    >
                      <div className={`relative ${darkMode ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-600'} p-2 rounded-full`}>
                        <FaUser className="w-5 h-5 text-white" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="text-left hidden lg:block">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                      <FaChevronDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-30"
                          onClick={() => setIsProfileOpen(false)}
                        ></div>
                        <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-2 z-40 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} animate-fadeIn`}>
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-medium dark:text-white">{user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                          </div>
                          
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <FaUser className="w-4 h-4" />
                            </div>
                            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>My Profile</span>
                          </Link>
                          
                          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center justify-between w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${darkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                <FaSignOutAlt className="w-4 h-4" />
                              </div>
                              <span>Logout</span>
                            </div>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                      darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                ) : (
                  <FiMenu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'} animate-slideDown`}>
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive(link.path)
                      ? `${darkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-blue-600'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  <span className={`text-lg ${isActive(link.path) ? 'text-blue-500' : 'text-gray-400'}`}>
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              
              {!user && (
                <div className="flex space-x-3 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex-1 px-4 py-3 text-center rounded-lg font-medium ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-800' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 px-4 py-3 text-center rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Add custom animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 500px;
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;