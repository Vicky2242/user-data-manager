import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, Alert } from '../components/Common/index';
import { authAPI } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('password');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setError('Password must be at least 8 characters');
        setLoading(false);
        return;
      }

      await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      setSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (window.confirm('This will logout from all devices. Continue?')) {
      try {
        setLoading(true);
        await authAPI.logout();
        navigate('/login');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to logout');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="w-full max-w-3xl mx-auto">
        {error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b flex flex-wrap">
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base transition border-b-2 ${
                activeTab === 'password'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🔒 Password
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base transition border-b-2 ${
                activeTab === 'security'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🛡️ Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base transition border-b-2 ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🔔 Notifications
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  <form onSubmit={handleSubmitPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="text-sm">
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Active Sessions</h4>
                  <p className="text-sm text-yellow-800 mb-4">
                    You are currently logged in. Logging out from all devices will clear all sessions.
                  </p>
                  <Button
                    onClick={handleLogoutAllDevices}
                    disabled={loading}
                    variant="danger"
                    className="text-sm"
                  >
                    🚪 Logout from All Devices
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Security Information</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Your account is protected with JWT authentication</li>
                    <li>✓ Passwords are hashed with bcrypt (10 rounds)</li>
                    <li>✓ Account locks after 5 failed login attempts</li>
                    <li>✓ All sensitive data is encrypted in transit (HTTPS)</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates about account activity</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Client Updates</p>
                      <p className="text-sm text-gray-600">Notify when clients are added or modified</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Export Reports</p>
                      <p className="text-sm text-gray-600">Notify when data exports are complete</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Security Alerts</p>
                      <p className="text-sm text-gray-600">Notify about login attempts and changes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                  </div>
                </div>

                <Button className="text-sm">Save Preferences</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
