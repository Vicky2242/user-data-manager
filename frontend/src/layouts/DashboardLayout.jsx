import React from 'react';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 w-full mt-14 sm:mt-16 lg:mt-0 p-2 sm:p-4 md:p-6 lg:p-8">
          {title && (
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
