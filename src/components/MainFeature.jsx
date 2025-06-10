import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';
import { taskService, categoryService, statisticsService } from '../services';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Listen for keyboard shortcut to open add modal
  useEffect(() => {
    const handleOpenAddTask = () => setShowAddModal(true);
    document.addEventListener('openAddTask', handleOpenAddTask);
    return () => document.removeEventListener('openAddTask', handleOpenAddTask);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData, statsData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll(),
        statisticsService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
      setStatistics(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setShowAddModal(false);
      toast.success('Task created successfully');
      // Refresh statistics
      const stats = await statisticsService.getAll();
      setStatistics(stats);
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.update(id, updates);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      if (updates.completed !== undefined) {
        toast.success(updates.completed ? 'Task completed!' : 'Task marked as pending');
        // Refresh statistics
        const stats = await statisticsService.getAll();
        setStatistics(stats);
      } else {
        toast.success('Task updated');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted');
      // Refresh statistics
      const stats = await statisticsService.getAll();
      setStatistics(stats);
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category created');
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoryService.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.categoryId === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesStatus = showCompleted ? task.completed : !task.completed;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

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

  const getCategoryById = (id) => categories.find(cat => cat.id === id);

  if (loading) {
    return (
      <div className="h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Left column skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="bg-white rounded-lg p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right column skeleton */}
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">TaskFlow</h1>
            <p className="text-gray-600 mt-1">
              {statistics?.completedToday || 0} tasks completed today
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCategoryManager(true)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="Settings" size={20} className="mr-2" />
              Categories
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Add Task
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="lg:col-span-3 flex flex-col overflow-hidden">
            {/* Filter Bar */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                {/* Priority Filter */}
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                
                {/* Status Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowCompleted(false)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !showCompleted 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setShowCompleted(true)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      showCompleted 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-lg shadow-sm flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto h-full">
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <ApperIcon name="CheckSquare" className="w-16 h-16 text-gray-300 mx-auto" />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-heading font-medium text-gray-900">
                      {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' 
                        ? 'No matching tasks' 
                        : showCompleted 
                          ? 'No completed tasks yet'
                          : 'No tasks yet'
                      }
                    </h3>
                    <p className="mt-2 text-gray-500">
                      {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all'
                        ? 'Try adjusting your filters'
                        : showCompleted
                          ? 'Complete some tasks to see them here'
                          : 'Create your first task to get started'
                      }
                    </p>
                    {!showCompleted && !searchQuery && selectedCategory === 'all' && selectedPriority === 'all' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-medium"
                      >
                        Create Task
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredTasks.map((task, index) => {
                        const category = getCategoryById(task.categoryId);
                        const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed;
                        
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.1 }}
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
                                onClick={() => handleUpdateTask(task.id, { completed: !task.completed })}
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
                                      onClick={() => setSelectedTask(task)}
                                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                    >
                                      <ApperIcon name="Edit" size={16} />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteTask(task.id)}
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
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6">
            {/* Statistics Cards */}
            {statistics && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold text-gray-900">Progress</h2>
                
                {/* Completion Rate */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Today's Progress</h3>
                    <span className="text-2xl font-bold text-primary">
                      {Math.round(statistics.completionRate)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${statistics.completionRate}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {statistics.completedToday} of {statistics.totalTasks} tasks completed
                  </p>
                </div>
                
                {/* Streak Counter */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Current Streak</h3>
                      <p className="text-sm text-gray-600">Days with completed tasks</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-accent">
                        {statistics.currentStreak}
                      </span>
                      <p className="text-sm text-gray-600">days</p>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-4">This Week</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-semibold text-success">
                        {statistics.completedThisWeek}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Tasks</span>
                      <span className="font-semibold text-gray-900">
                        {statistics.totalTasks}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                {Object.keys(statistics.tasksByCategory).length > 0 && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-medium text-gray-900 mb-4">By Category</h3>
                    <div className="space-y-3">
                      {Object.entries(statistics.tasksByCategory).map(([categoryId, count]) => {
                        const category = getCategoryById(categoryId);
                        if (!category) return null;
                        
                        return (
                          <div key={categoryId} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-sm text-gray-600">{category.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      <TaskModal
        isOpen={showAddModal || selectedTask}
        onClose={() => {
          setShowAddModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        categories={categories}
        onSubmit={selectedTask ? 
          (data) => handleUpdateTask(selectedTask.id, data) : 
          handleCreateTask
        }
      />

      {/* Category Manager Modal */}
      <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
        categories={categories}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};

// Task Modal Component
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
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };
    
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-20 resize-none"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">No category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
              >
                {task ? 'Update Task' : 'Create Task'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Category Manager Component
const CategoryManager = ({ isOpen, onClose, categories, onCreateCategory, onDeleteCategory }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B21B6',
    icon: '📋'
  });

  const predefinedColors = [
    '#5B21B6', '#8B5CF6', '#F59E0B', '#10B981', 
    '#EF4444', '#3B82F6', '#8B5A2B', '#059669'
  ];

  const predefinedIcons = ['📋', '💼', '🏠', '🛒', '💪', '📚', '🎯', '⭐'];

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
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </button>
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
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteCategory(category.id)}
                  className="p-1 text-gray-400 hover:text-error"
                >
                  <ApperIcon name="Trash2" size={16} />
                </motion.button>
              </div>
            ))}
          </div>

          {/* Add Category Form */}
          {showAddForm ? (
            <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter category name"
                  required
                />
              </div>

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
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Add Category
                </motion.button>
              </div>
            </form>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary"
            >
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Add New Category
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MainFeature;