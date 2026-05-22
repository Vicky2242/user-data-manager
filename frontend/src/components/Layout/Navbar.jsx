import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/authApi';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 flex justify-between items-center min-h-14 sm:min-h-16">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-600 truncate">📊 User Data Manager</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium hidden sm:inline truncate">
            {auth?.admin?.name}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-1 sm:gap-2 text-gray-700 hover:text-gray-900 focus:outline-none p-1 hover:bg-gray-100 rounded-lg transition"
              aria-label="Profile menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-xl py-1 sm:py-2 z-50">
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  👤 My Profile
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  ⚙️ Settings
                </button>
                <hr className="my-1 sm:my-2" />
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 font-medium transition"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
