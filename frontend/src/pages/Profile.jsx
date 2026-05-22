import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, Alert, LoadingSpinner } from '../components/Common/index';
import { authAPI } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: auth?.admin?.name || '',
    email: auth?.admin?.email || '',
  });

  useEffect(() => {
    if (auth?.admin) {
      setFormData({
        name: auth.admin.name || '',
        email: auth.admin.email || '',
      });
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await authAPI.updateProfile(formData.name, formData.email);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="w-full max-w-2xl mx-auto">
        {error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert type="success" onClose={() => setSuccess(null)}>{success}</Alert>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-3 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-4xl shadow-lg">
                👤
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{auth?.admin?.name}</h2>
                <p className="text-blue-100 text-sm sm:text-base">{auth?.admin?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="text-sm flex-1 sm:flex-none"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    className="text-sm flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                  <p className="text-base sm:text-lg text-gray-900">{auth?.admin?.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                  <p className="text-base sm:text-lg text-gray-900">{auth?.admin?.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
                  <p className="text-base sm:text-lg text-gray-900 capitalize">
                    {auth?.admin?.role || 'Admin'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Account Status</h3>
                  <p className="text-base sm:text-lg">
                    {auth?.admin?.isActive ? (
                      <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                        ✓ Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-red-600 font-medium">
                        ✕ Inactive
                      </span>
                    )}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={() => setIsEditing(true)} className="text-sm">
                    ✏️ Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Account Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Your profile is secured with JWT authentication</li>
            <li>✓ All your data is encrypted in transit</li>
            <li>✓ Change password from Settings</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
