import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button, Alert, LoadingSpinner } from '../components/Common/index';
import { clientAPI } from '../api/clientApi';
import { customFieldAPI } from '../api/customFieldApi';
import CustomFieldInput from '../components/Common/CustomFieldInput';

const ClientCreate = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm();
  const [serverError, setServerError] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [fieldsLoading, setFieldsLoading] = useState(true);

  useEffect(() => {
    fetchCustomFields();
  }, []);

  const fetchCustomFields = async () => {
    try {
      const fields = await customFieldAPI.getAll();
      setCustomFields(fields);
    } catch (err) {
      console.error('Failed to load custom fields:', err);
    } finally {
      setFieldsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setServerError('');

      const customFieldsData = {};
      customFields.forEach((field) => {
        if (data[field.fieldKey] !== undefined) {
          customFieldsData[field.fieldKey] = data[field.fieldKey];
        }
      });

      const submitData = {
        ...data,
        customFields: Object.keys(customFieldsData).length > 0 ? customFieldsData : undefined,
      };

      await clientAPI.create(submitData);
      navigate('/clients');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to create client');
    }
  };

  return (
    <DashboardLayout title="Create New Client">
      <div className="w-full max-w-2xl mx-auto">
        {serverError && (
          <Alert type="error" onClose={() => setServerError('')}>
            {serverError}
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 mt-4 sm:mt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Client name"
                  />
                  {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10-digit phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    {...register('businessName')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Business name"
                  />
                </div>
              </div>
            </div>

            {/* Government IDs */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Government IDs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <input
                    {...register('aadhaarNumber')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="12-digit Aadhaar"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                  <input
                    {...register('panNumber')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="ABCDE1234F"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    {...register('gstin')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="15-digit GST number"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">IEC Code</label>
                  <input
                    {...register('iecCode')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="IEC code"
                  />
                </div>
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

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    {...register('businessAddress.city')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    {...register('businessAddress.state')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    {...register('businessAddress.postalCode')}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Postal code"
                  />
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

            {/* Custom Fields */}
            {!fieldsLoading && customFields.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {customFields.map((field) => (
                    <CustomFieldInput
                      key={field._id}
                      field={field}
                      register={register}
                      errors={errors}
                      watch={watch}
                      setValue={setValue}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end pt-2 sm:pt-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate('/clients')}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                {isSubmitting ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientCreate;
