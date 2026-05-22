import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Clients', icon: '👥', path: '/clients' },
    { label: 'Custom Fields', icon: '⚙️', path: '/custom-fields' },
    { label: 'Reports', icon: '📈', path: '/reports' },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 sm:top-3.5 left-3 sm:left-4 z-40 p-2 sm:p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition touch-target"
        aria-label="Toggle sidebar"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-14 sm:top-16 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-52 sm:w-56 bg-gray-900 text-white transition-transform duration-300 lg:translate-x-0 lg:top-16 lg:sticky lg:h-[calc(100vh-64px)] z-30 overflow-y-auto`}
      >
        <div className="p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold mb-6 sm:mb-8 flex items-center gap-2">
            <span className="text-lg sm:text-xl">📋</span> <span className="truncate">Menu</span>
          </h2>

          <nav className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition touch-target ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span className="text-base sm:text-xl flex-shrink-0">{item.icon}</span>
                <span className="text-sm sm:text-base truncate">{item.label}</span>
              </Link>
            ))}
          </nav>

          <hr className="my-6 sm:my-8 border-gray-700" />

          <div className="text-xs sm:text-sm text-gray-500 p-3 sm:p-4 bg-gray-800 rounded-lg">
            <p className="font-semibold mb-2 text-gray-300">Quick Tips</p>
            <ul className="space-y-1">
              <li>✓ Search clients</li>
              <li>✓ Upload documents</li>
              <li>✓ Export to CSV/PDF</li>
              <li>✓ Manage fields</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 top-14 sm:top-16"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
