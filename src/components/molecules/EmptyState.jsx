import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const EmptyState = ({ iconName, title, message, actionButtonText, onActionButtonClick, className }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={iconName} className="w-16 h-16 text-gray-300 mx-auto" />
      </motion.div>
      <h3 className="mt-4 text-lg font-heading font-medium text-gray-900">
        {title}
      </h3>
      <p className="mt-2 text-gray-500">
        {message}
      </p>
      {actionButtonText && onActionButtonClick && (
        <Button onClick={onActionButtonClick} className="mt-4 px-6 py-3" variant="primary">
          {actionButtonText}
        </Button>
      )}
    </motion.div>
  );
};

EmptyState.propTypes = {
  iconName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionButtonText: PropTypes.string,
  onActionButtonClick: PropTypes.func,
  className: PropTypes.string,
};

export default EmptyState;