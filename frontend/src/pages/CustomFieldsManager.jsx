import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, LoadingSpinner, Alert, Badge } from '../components/Common/index';
import { customFieldAPI } from '../api/customFieldApi';

const FIELD_TYPES = ['text', 'number', 'email', 'phone', 'date', 'checkbox', 'select', 'textarea'];

const CustomFieldsManager = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    fieldKey: '',
    fieldType: 'text',
    description: '',
    isRequired: false,
    options: '',
  });

  useEffect(() => {
    fetchCustomFields();
  }, []);

  const fetchCustomFields = async () => {
    try {
      setLoading(true);
      const data = await customFieldAPI.getAll(true);
      setFields(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load custom fields');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const submitData = {
        ...formData,
        options: formData.fieldType === 'select' ? formData.options.split(',').map(o => o.trim()) : [],
      };

      if (editingId) {
        await customFieldAPI.update(editingId, submitData);
      } else {
        await customFieldAPI.create(submitData);
      }

      resetForm();
      fetchCustomFields();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save custom field');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this custom field?')) return;
    try {
      await customFieldAPI.delete(id);
      fetchCustomFields();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete custom field');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await customFieldAPI.bulkUpdate([id], !isActive);
      fetchCustomFields();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update custom field');
    }
  };

  const handleEdit = (field) => {
    setFormData({
      name: field.name,
      fieldKey: field.fieldKey,
      fieldType: field.fieldType,
      description: field.description || '',
      isRequired: field.isRequired,
      options: field.options?.join(', ') || '',
    });
    setEditingId(field._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fieldKey: '',
      fieldType: 'text',
      description: '',
      isRequired: false,
      options: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout title="Custom Fields Manager">
      {error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}

      <div className="mb-6">
        <Button onClick={() => setShowForm(!showForm)} className="text-xs sm:text-sm">
          {showForm ? '✕ Cancel' : '➕ New Custom Field'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Create'} Custom Field</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Field Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Passport Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Field Key *</label>
                <input
                  type="text"
                  value={formData.fieldKey}
                  onChange={(e) => setFormData({ ...formData, fieldKey: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="e.g., passport_number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                  disabled={editingId ? true : false}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Field Type *</label>
                <select
                  value={formData.fieldType}
                  onChange={(e) => setFormData({ ...formData, fieldType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                  disabled={editingId ? true : false}
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {formData.fieldType === 'select' && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Options (comma-separated)</label>
                <input
                  type="text"
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder="Option 1, Option 2, Option 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRequired}
                onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-xs sm:text-sm text-gray-700">Required field</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="text-xs sm:text-sm flex-1 sm:flex-none">
                {editingId ? 'Update' : 'Create'} Field
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm} className="text-xs sm:text-sm flex-1 sm:flex-none">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : fields.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-sm sm:text-base mb-4">No custom fields yet</p>
          <Button onClick={() => setShowForm(true)}>Create First Custom Field</Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden sm:table-cell">Key</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-center text-xs sm:text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fields.map((field) => (
                  <tr key={field._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium">{field.name}</td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{field.fieldKey}</td>
                    <td className="px-4 py-3 text-xs sm:text-sm hidden md:table-cell">
                      <Badge variant="blue">{field.fieldType}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={field.isActive ? 'green' : 'gray'}>
                        {field.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => handleToggleActive(field._id, field.isActive)}
                          className="text-yellow-600 hover:text-yellow-700 text-lg p-1 hover:bg-yellow-50 rounded"
                          title={field.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {field.isActive ? '✓' : '○'}
                        </button>
                        <button
                          onClick={() => handleEdit(field)}
                          className="text-green-600 hover:text-green-700 text-lg p-1 hover:bg-green-50 rounded"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(field._id)}
                          className="text-red-600 hover:text-red-700 text-lg p-1 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CustomFieldsManager;
