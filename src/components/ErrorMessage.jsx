import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error message component
 */
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {message}
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default ErrorMessage; 