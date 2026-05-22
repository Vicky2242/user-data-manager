import React from 'react';

const CustomFieldInput = ({ field, register, errors, watch, setValue }) => {
  const value = watch(field.fieldKey) || '';

  const baseClasses = 'w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base';
  const errorClass = errors[field.fieldKey] ? 'border-red-500' : 'border-gray-300';

  switch (field.fieldType) {
    case 'text':
    case 'email':
    case 'phone':
      return (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {field.name}
            {field.isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            {...register(field.fieldKey, { required: field.isRequired ? `${field.name} is required` : false })}
            type={field.fieldType === 'email' ? 'email' : field.fieldType === 'phone' ? 'tel' : 'text'}
            placeholder={field.description || field.name}
            className={`${baseClasses} ${errorClass}`}
          />
          {errors[field.fieldKey] && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.fieldKey].message}</p>
          )}
        </div>
      );

    case 'number':
      return (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {field.name}
            {field.isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            {...register(field.fieldKey, { required: field.isRequired ? `${field.name} is required` : false })}
            type="number"
            placeholder={field.description || field.name}
            className={`${baseClasses} ${errorClass}`}
          />
          {errors[field.fieldKey] && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.fieldKey].message}</p>
          )}
        </div>
      );

    case 'date':
      return (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {field.name}
            {field.isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            {...register(field.fieldKey, { required: field.isRequired ? `${field.name} is required` : false })}
            type="date"
            className={`${baseClasses} ${errorClass}`}
          />
          {errors[field.fieldKey] && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.fieldKey].message}</p>
          )}
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-center pt-2">
          <input
            {...register(field.fieldKey)}
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="ml-2 text-xs sm:text-sm text-gray-700">{field.name}</label>
        </div>
      );

    case 'select':
      return (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {field.name}
            {field.isRequired && <span className="text-red-500">*</span>}
          </label>
          <select
            {...register(field.fieldKey, { required: field.isRequired ? `${field.name} is required` : false })}
            className={`${baseClasses} ${errorClass}`}
          >
            <option value="">Select {field.name}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors[field.fieldKey] && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.fieldKey].message}</p>
          )}
        </div>
      );

    case 'textarea':
      return (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {field.name}
            {field.isRequired && <span className="text-red-500">*</span>}
          </label>
          <textarea
            {...register(field.fieldKey, { required: field.isRequired ? `${field.name} is required` : false })}
            placeholder={field.description || field.name}
            className={`${baseClasses} ${errorClass} resize-none`}
            rows="3"
          />
          {errors[field.fieldKey] && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.fieldKey].message}</p>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default CustomFieldInput;
