import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, LoadingSpinner } from '../components/Common/index';
import { clientAPI } from '../api/clientApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clients: 0, documents: 0, fields: 0 });
  const [loading, setLoading] = useState(true);
  const [recentClients, setRecentClients] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await clientAPI.getAll(1, 5);
      setRecentClients(data.clients);
      setStats({
        clients: data.pagination.totalClients,
        documents: 0,
        fields: 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 border-l-4 border-blue-600 hover:shadow-lg transition">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Total Clients</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.clients}</p>
                </div>
                <span className="text-4xl sm:text-5xl flex-shrink-0">👥</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 border-l-4 border-green-600 hover:shadow-lg transition">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Documents</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">0</p>
                </div>
                <span className="text-4xl sm:text-5xl flex-shrink-0">📄</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 border-l-4 border-purple-600 hover:shadow-lg transition">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-gray-600 text-xs sm:text-sm font-medium">Custom Fields</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">0</p>
                </div>
                <span className="text-4xl sm:text-5xl flex-shrink-0">⚙️</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <Button onClick={() => navigate('/clients/create')} className="w-full text-xs sm:text-sm">
                ➕ Create Client
              </Button>
              <Button variant="secondary" onClick={() => navigate('/clients')} className="w-full text-xs sm:text-sm">
                👥 View Clients
              </Button>
              <Button variant="secondary" onClick={() => navigate('/custom-fields')} className="w-full text-xs sm:text-sm">
                ⚙️ Fields
              </Button>
              <Button variant="secondary" onClick={() => navigate('/reports')} className="w-full text-xs sm:text-sm">
                📊 Reports
              </Button>
            </div>
          </div>

          {/* Recent Clients */}
          {recentClients.length > 0 && (
            <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Recent Clients</h2>
              <div className="space-y-2 sm:space-y-3">
                {recentClients.map((client) => (
                  <div
                    key={client._id}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                    onClick={() => navigate(`/clients/${client._id}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{client.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{client.email}</p>
                    </div>
                    <span className="text-gray-400 flex-shrink-0 ml-2">→</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-4 sm:p-6 md:p-8 text-white">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Welcome to User Data Manager! 👋</h2>
            <p className="text-sm sm:text-base text-blue-100 mb-3 sm:mb-4">
              Manage your client data securely with encryption, custom fields, and document storage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl flex-shrink-0">🔒</span>
                <div className="min-w-0">
                  <p className="font-semibold">Secure Encryption</p>
                  <p className="text-blue-100 text-xs sm:text-sm">AES-256 encryption</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl flex-shrink-0">📁</span>
                <div className="min-w-0">
                  <p className="font-semibold">Document Management</p>
                  <p className="text-blue-100 text-xs sm:text-sm">Upload & organize</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl flex-shrink-0">📊</span>
                <div className="min-w-0">
                  <p className="font-semibold">Export Features</p>
                  <p className="text-blue-100 text-xs sm:text-sm">CSV or PDF reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;

