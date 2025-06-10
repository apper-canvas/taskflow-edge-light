import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { format, parseISO } from 'date-fns';
import PropTypes from 'prop-types';

const TaskModal = ({ isOpen, onClose, task, categories, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        categoryId: task.categoryId || '',
        priority: task.priority,
        dueDate: task.dueDate ? format(parseISO(task.dueDate), 'yyyy-MM-dd') : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        priority: 'medium',
        dueDate: ''
      });
    }
  }, [task, isOpen]); // Added isOpen to dependency array to reset form when modal opens without a task

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };
    
    onSubmit(submitData);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...categories.map(category => ({
      value: category.id,
      label: `${category.icon} ${category.name}`
    }))
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">
                {task ? 'Edit Task' : 'Add New Task'}
              </h3>
              <Button onClick={onClose} variant="ghost" className="p-2">
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />

              <FormField
                label="Description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                textarea
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Category"
                  id="categoryId"
                  type="select"
                  value={formData.categoryId}
                  onChange={handleChange}
                  options={categoryOptions}
                />

                <FormField
                  label="Priority"
                  id="priority"
                  type="select"
                  value={formData.priority}
                  onChange={handleChange}
                  options={priorityOptions}
                />
              </div>

              <FormField
                label="Due Date"
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" onClick={onClose} variant="text" className="px-4 py-2">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="px-6 py-2">
                  {task ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.object, // Can be null for new task
  categories: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default TaskModal;