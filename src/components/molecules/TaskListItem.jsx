import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { format, isToday, isPast, parseISO } from 'date-fns';
import PropTypes from 'prop-types';

const TaskListItem = ({ task, category, onToggleComplete, onEdit, onDelete, index }) => {
  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed;

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '⚡';
      case 'medium': return '◐';
      case 'low': return '○';
      default: return '○';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-gray-300 text-gray-700';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-surface rounded-lg p-4 border-l-4 hover:shadow-md transition-all ${
        task.completed ? 'opacity-75' : ''
      } ${
        isOverdue ? 'border-l-error' : 'border-l-primary'
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleComplete(task.id, !task.completed)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-success border-success'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <ApperIcon name="Check" size={14} className="text-white" />
            </motion.div>
          )}
        </motion.button>
        
        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
              
              {/* Task Meta */}
              <div className="flex items-center flex-wrap gap-2 mt-3">
                {/* Priority */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  <span className="mr-1">{getPriorityIcon(task.priority)}</span>
                  {task.priority}
                </span>
                
                {/* Category */}
                {category && (
                  <span 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </span>
                )}
                
                {/* Due Date */}
                {task.dueDate && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isOverdue 
                      ? 'bg-error text-white'
                      : isToday(parseISO(task.dueDate))
                        ? 'bg-warning text-white'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    <ApperIcon name="Calendar" size={12} className="mr-1" />
                    {format(parseISO(task.dueDate), 'MMM d')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ApperIcon name="Edit" size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-400 hover:text-error rounded-lg hover:bg-gray-100"
              >
                <ApperIcon name="Trash2" size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

TaskListItem.propTypes = {
  task: PropTypes.object.isRequired,
  category: PropTypes.object, // Can be null if no category
  onToggleComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};


export default TaskListItem;