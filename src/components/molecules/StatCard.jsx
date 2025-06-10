import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ title, value, description, iconName, progress, colorClass = 'text-primary', className = '', chartData }) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        {iconName && <ApperIcon name={iconName} size={24} className={colorClass} />}
        {value && <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>}
      </div>
      {progress !== undefined && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </>
      )}
      {description && progress === undefined && (
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      )}
      {chartData && (
        <div className="space-y-3 mt-4">
          {Object.entries(chartData).map(([label, count]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-gray-600">{label}</span>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatCard;