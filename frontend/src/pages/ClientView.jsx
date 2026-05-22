import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, LoadingSpinner, Alert, Badge } from '../components/Common/index';
import { clientAPI } from '../api/clientApi';

const ClientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const data = await clientAPI.getById(id);
      setClient(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      await clientAPI.delete(id);
      navigate('/clients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete client');
    }
  };

  if (loading) return <DashboardLayout title="Client Details"><LoadingSpinner /></DashboardLayout>;

  if (!client) return <DashboardLayout title="Client Details"><Alert type="error">{error || 'Client not found'}</Alert></DashboardLayout>;

  return (
    <DashboardLayout title="Client Details">
      <div className="w-full max-w-4xl mx-auto">
        {error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 mt-4 sm:mt-6">
          {/* Header with Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 pb-4 border-b">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{client.name}</h2>
              <p className="text-gray-600 text-xs sm:text-sm">{client.email}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="secondary" size="sm" onClick={() => navigate('/clients')} className="flex-1 sm:flex-none text-xs sm:text-sm">
                ← Back
              </Button>
              <Button size="sm" onClick={() => navigate(`/clients/${id}/edit`)} className="flex-1 sm:flex-none text-xs sm:text-sm">
                ✏️ Edit
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete} className="flex-1 sm:flex-none text-xs sm:text-sm">
                🗑️ Delete
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label="Name" value={client.name} />
              <DetailField label="Email" value={client.email} />
              <DetailField label="Phone" value={client.phone} />
              <DetailField label="Business Name" value={client.businessName} />
            </div>
          </div>

          {/* Government IDs */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Government IDs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailField label="Aadhaar Number" value={client.aadhaarNumber || 'N/A'} masked />
              <DetailField label="PAN Number" value={client.panNumber || 'N/A'} />
              <DetailField label="GST Number" value={client.gstin || 'N/A'} />
              <DetailField label="IEC Code" value={client.iecCode || 'N/A'} />
            </div>
          </div>

          {/* Business Details */}
          {(client.businessType || client.businessAddress) && (
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {client.businessType && <DetailField label="Business Type" value={<Badge variant="blue">{client.businessType}</Badge>} />}
                {client.businessAddress?.city && <DetailField label="City" value={client.businessAddress.city} />}
                {client.businessAddress?.state && <DetailField label="State" value={client.businessAddress.state} />}
                {client.businessAddress?.postalCode && <DetailField label="Postal Code" value={client.businessAddress.postalCode} />}
              </div>
            </div>
          )}

          {/* Bank Details */}
          {client.bankDetails && (
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailField label="Bank Name" value={client.bankDetails.bankName || 'N/A'} />
                <DetailField label="Account Holder" value={client.bankDetails.accountHolderName || 'N/A'} />
                <DetailField label="Account Type" value={client.bankDetails.accountType || 'N/A'} />
                <DetailField label="IFSC Code" value={client.bankDetails.ifscCode || 'N/A'} />
              </div>
            </div>
          )}

          {/* Custom Fields */}
          {client.customFields && Object.keys(client.customFields).length > 0 && (
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Custom Fields</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(client.customFields).map(([key, value]) => (
                  <DetailField key={key} label={key.replace(/_/g, ' ')} value={String(value) || 'N/A'} />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-gray-700 text-sm sm:text-base whitespace-pre-wrap">{client.notes}</div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4 text-xs sm:text-sm text-gray-500">
            <p>Created: {new Date(client.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(client.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const DetailField = ({ label, value, masked = false }) => (
  <div>
    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{label}</p>
    <p className="text-sm sm:text-base text-gray-900">{masked && value && value.length > 4 ? '****' + value.slice(-4) : value}</p>
  </div>
);

export default ClientView;
