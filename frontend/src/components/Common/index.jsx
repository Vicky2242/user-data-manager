import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2 whitespace-nowrap';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400',
  };

  const sizes = {
    sm: 'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm min-h-8 sm:min-h-9',
    md: 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base min-h-10 sm:min-h-11',
    lg: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg min-h-11 sm:min-h-12',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin text-xs sm:text-sm">⏳</span>}
      {children}
    </button>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b flex-shrink-0">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold truncate">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1 text-sm sm:text-base">{children}</div>
      </div>
    </div>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-6 sm:p-8">
    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
  </div>
);

export const Alert = ({ type = 'info', children, onClose }) => {
  const bgColors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  };

  return (
    <div className={`border rounded-lg p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base ${bgColors[type]}`}>
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1">
        <span className="text-lg sm:text-xl flex-shrink-0">{icons[type]}</span>
        <span className="break-words">{children}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-xs sm:text-sm font-medium flex-shrink-0 p-1 hover:bg-opacity-50 rounded" aria-label="Close alert">
          ✕
        </button>
      )}
    </div>
  );
};

export const Badge = ({ children, variant = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${colors[variant]}`}>
      {children}
    </span>
  );
};
