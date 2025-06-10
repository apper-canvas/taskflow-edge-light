import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', variant = 'primary', whileHover, whileTap, ...props }) => {
  let baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  if (variant === 'primary') {
    baseStyles += ' bg-primary text-white rounded-lg shadow-md hover:shadow-lg focus:ring-primary';
  } else if (variant === 'secondary') {
    baseStyles += ' bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 focus:ring-gray-300';
  } else if (variant === 'text') {
    baseStyles += ' text-gray-600 rounded-lg hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300';
  } else if (variant === 'danger') {
    baseStyles += ' bg-error text-white rounded-lg shadow-md hover:shadow-lg focus:ring-error';
  } else if (variant === 'ghost') {
    baseStyles += ' text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 focus:ring-gray-300';
  } else if (variant === 'dashed') {
    baseStyles += ' border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary focus:ring-primary';
  }

  // Define default motion props if not provided
  const defaultWhileHover = whileHover === undefined ? { scale: 1.05 } : whileHover;
  const defaultWhileTap = whileTap === undefined ? { scale: 0.95 } : whileTap;

  return (
    <motion.button
      className={`${baseStyles} ${className}`}
      whileHover={defaultWhileHover}
      whileTap={defaultWhileTap}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;