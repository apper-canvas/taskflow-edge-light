import React from 'react';

const Input = ({ className = '', type = 'text', ...props }) => {
  const baseStyles = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent';
  return (
    <input
      type={type}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

export default Input;