import React from 'react';

const Select = ({ children, className = '', ...props }) => {
  const baseStyles = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent';
  return (
    <select
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;