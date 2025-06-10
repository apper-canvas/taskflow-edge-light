import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import PropTypes from 'prop-types';

const predefinedColors = [
  '#5B21B6', '#8B5CF6', '#F59E0B', '#10B981', 
  '#EF4444', '#3B82F6', '#8B5A2B', '#059669'
];

const predefinedIcons = ['📋', '💼', '🏠', '🛒', '💪', '📚', '🎯', '⭐'];

const CategoryManager = ({ isOpen, onClose, categories, onCreateCategory, onDeleteCategory }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B21B6',
    icon: '📋'
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onCreateCategory(formData);
    setFormData({ name: '', color: '#5B21B6', icon: '📋' });
    setShowAddForm(false);
  };

  if (!isOpen) return null;

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
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">
                Manage Categories
              </h3>
              <Button onClick={onClose} variant="ghost" className="p-2">
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Existing Categories */}
            <div className="space-y-3 mb-6">
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">({category.taskCount || 0})</span>
                  </div>
                  <Button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDeleteCategory(category.id)}
                    variant="ghost"
                    className="p-1 hover:text-error"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Category Form */}
            {showAddForm ? (
              <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
                <FormField
                  label="Category Name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    {predefinedColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="flex space-x-2 flex-wrap">
                    {predefinedIcons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`p-2 text-lg rounded border ${
                          formData.icon === icon 
                            ? 'border-primary bg-primary/10' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    variant="text"
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="px-4 py-2">
                    Add Category
                  </Button>
                </div>
              </form>
            ) : (
              <Button onClick={() => setShowAddForm(true)} variant="dashed" className="w-full px-4 py-3">
                <ApperIcon name="Plus" size={20} className="mr-2" />
                Add New Category
              </Button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

CategoryManager.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  onCreateCategory: PropTypes.func.isRequired,
  onDeleteCategory: PropTypes.func.isRequired,
};

export default CategoryManager;