import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, LoadingSpinner, Alert } from '../components/Common/index';
import { clientAPI } from '../api/clientApi';
import { customFieldAPI } from '../api/customFieldApi';
import CustomFieldInput from '../components/Common/CustomFieldInput';

const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const data = await clientAPI.getById(id);

      // Populate form with existing data
      Object.keys(data).forEach((key) => {
        if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
          Object.keys(data[key]).forEach((subKey) => {
            setValue(`${key}.${subKey}`, data[key][subKey]);
          });
        } else if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'customFields') {
          setValue(key, data[key]);
        }
      });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setServerError('');
      await clientAPI.update(id, data);
      navigate(`/clients/${id}`);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to update client');
    }
  };

  if (loading) return <DashboardLayout title="Edit Client"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Edit Client">
      <div className="w-full max-w-2xl mx-auto">
        {serverError && <Alert type="error" onClose={() => setServerError('')}>{serverError}</Alert>}

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 mt-4 sm:mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField register={register} name="name" label="Name *" errors={errors} required />
                <FormField register={register} name="email" label="Email *" type="email" errors={errors} required />
                <FormField register={register} name="phone" label="Phone *" errors={errors} required />
                <FormField register={register} name="businessName" label="Business Name" errors={errors} />
              </div>
            </div>

            {/* Government IDs */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Government IDs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField register={register} name="aadhaarNumber" label="Aadhaar Number" errors={errors} />
                <FormField register={register} name="panNumber" label="PAN Number" errors={errors} />
                <FormField register={register} name="gstin" label="GST Number" errors={errors} />
                <FormField register={register} name="iecCode" label="IEC Code" errors={errors} />
              </div>
            </div>

            {/* Business Details */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Business Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Business Type</label>
                  <select
                    {...register('businessType')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select type</option>
                    <option value="sole-proprietor">Sole Proprietor</option>
                    <option value="partnership">Partnership</option>
                    <option value="pvt-ltd">Private Limited</option>
                    <option value="llp">LLP</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <FormField register={register} name="businessAddress.city" label="City" errors={errors} />
                <FormField register={register} name="businessAddress.state" label="State" errors={errors} />
                <FormField register={register} name="businessAddress.postalCode" label="Postal Code" errors={errors} />
              </div>
            </div>

            {/* Bank Details */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Bank Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField register={register} name="bankDetails.bankName" label="Bank Name" errors={errors} />
                <FormField register={register} name="bankDetails.accountHolderName" label="Account Holder Name" errors={errors} />
                <FormField register={register} name="bankDetails.accountNumber" label="Account Number" errors={errors} />
                <FormField register={register} name="bankDetails.ifscCode" label="IFSC Code" errors={errors} />
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <select
                    {...register('bankDetails.accountType')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    <option value="">Select type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                {...register('notes')}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                rows="4"
                placeholder="Additional notes about the client..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end pt-2 sm:pt-4 border-t">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate(`/clients/${id}`)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

const FormField = ({ register, name, label, type = 'text', errors, required = false, placeholder = '' }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...register(name, { required: required ? `${label} is required` : false })}
      type={type}
      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
        errors[name] ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder || label}
    />
    {errors[name] && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[name].message}</p>}
  </div>
);

export default ClientEdit;
