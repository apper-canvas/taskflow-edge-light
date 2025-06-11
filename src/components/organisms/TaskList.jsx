import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskListItem from '@/components/molecules/TaskListItem';
import EmptyState from '@/components/molecules/EmptyState';
import PropTypes from 'prop-types';

const TaskList = ({ tasks, getCategoryById, onToggleComplete, onEditTask, onDeleteTask, emptyStateProps }) => {
  const { searchQuery, selectedCategory, selectedPriority, showCompleted, onAddTaskClick } = emptyStateProps;

  const getEmptyStateMessage = () => {
    if (searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all') {
      return {
        title: 'No matching tasks',
        message: 'Try adjusting your filters',
        actionButtonText: null,
        onActionButtonClick: null,
      };
    } else if (showCompleted) {
      return {
        title: 'No completed tasks yet',
        message: 'Complete some tasks to see them here',
        actionButtonText: null,
        onActionButtonClick: null,
      };
    } else {
      return {
        title: 'No tasks yet',
        message: 'Create your first task to get started',
        actionButtonText: 'Create Task',
        onActionButtonClick: onAddTaskClick,
      };
    }
  };

  const emptyStateContent = getEmptyStateMessage();

  return (
    <div className="bg-white rounded-lg shadow-sm flex-1 overflow-hidden">
      <div className="p-6 overflow-y-auto h-full">
        {tasks.length === 0 ? (
          <EmptyState 
            iconName="CheckSquare" 
            title={emptyStateContent.title}
            message={emptyStateContent.message}
            actionButtonText={emptyStateContent.actionButtonText}
            onActionButtonClick={emptyStateContent.onActionButtonClick}
          />
        ) : (
          <div className="space-y-3">
<AnimatePresence>
              {tasks.map((task, index) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  category={getCategoryById(task.category_id)}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  getCategoryById: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  emptyStateProps: PropTypes.shape({
    searchQuery: PropTypes.string.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    selectedPriority: PropTypes.string.isRequired,
    showCompleted: PropTypes.bool.isRequired,
    onAddTaskClick: PropTypes.func.isRequired,
  }).isRequired,
};

export default TaskList;