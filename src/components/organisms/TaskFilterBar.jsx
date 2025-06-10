import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const TaskFilterBar = ({ categories, filters, onFilterChange }) => {
  const { searchQuery, selectedCategory, selectedPriority, showCompleted } = filters;

  const handleSearchChange = (e) => onFilterChange({ searchQuery: e.target.value });
  const handleCategoryChange = (e) => onFilterChange({ selectedCategory: e.target.value });
  const handlePriorityChange = (e) => onFilterChange({ selectedPriority: e.target.value });
  const handleStatusToggle = (completed) => onFilterChange({ showCompleted: completed });

  return (
    <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        {/* Search */}
        <div className="flex-1 relative">
          <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="search-input"
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2"
          />
        </div>
        
        {/* Category Filter */}
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        
        {/* Priority Filter */}
        <Select
          value={selectedPriority}
          onChange={handlePriorityChange}
          className="px-4 py-2"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </Select>
        
        {/* Status Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleStatusToggle(false)}
            className={`px-4 py-2 ${
              !showCompleted 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={null} whileTap={null} // Override default button animations
            variant="ghost" // Use ghost variant for base styling, then override bg/text
          >
            Active
          </Button>
          <Button
            onClick={() => handleStatusToggle(true)}
            className={`px-4 py-2 ${
              showCompleted 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={null} whileTap={null} // Override default button animations
            variant="ghost" // Use ghost variant for base styling, then override bg/text
          >
            Completed
          </Button>
        </div>
      </div>
    </div>
  );
};

TaskFilterBar.propTypes = {
  categories: PropTypes.array.isRequired,
  filters: PropTypes.shape({
    searchQuery: PropTypes.string.isRequired,
    selectedCategory: PropTypes.string.isRequired,
    selectedPriority: PropTypes.string.isRequired,
    showCompleted: PropTypes.bool.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default TaskFilterBar;