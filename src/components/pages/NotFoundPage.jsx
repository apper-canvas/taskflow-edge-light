import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ApperIcon name="AlertTriangle" size={64} className="text-accent mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist. Let's get you back to your tasks.
        </p>
        
        <Button onClick={() => navigate('/')} className="px-6 py-3" variant="primary">
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to Tasks
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;