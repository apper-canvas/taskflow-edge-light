import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { taskService, categoryService, statisticsService } from '@/services';
import PageHeader from '@/components/organisms/PageHeader';
import TaskFilterBar from '@/components/organisms/TaskFilterBar';
import TaskList from '@/components/organisms/TaskList';
import StatisticsSection from '@/components/organisms/StatisticsSection';
import TaskModal from '@/components/organisms/TaskModal';
import CategoryManager from '@/components/organisms/CategoryManager';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Filter State (lifted from TaskFilterBar for main component to use)
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedCategory: 'all',
    selectedPriority: 'all',
    showCompleted: false,
  });

  // Load initial data
  useEffect(() => {
    loadData();
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

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getCategoryById = useMemo(() => {
    const categoryMap = new Map();
    categories.forEach(cat => categoryMap.set(cat.id, cat));
    return (id) => categoryMap.get(id);
  }, [categories]);

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    const { searchQuery, selectedCategory, selectedPriority, showCompleted } = filters;
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || task.categoryId === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
      const matchesStatus = showCompleted ? task.completed : !task.completed;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [tasks, filters]);

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
          <Button onClick={loadData} variant="primary" className="px-6 py-3">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6 h-full flex flex-col">
        <PageHeader 
          title="TaskFlow"
          subtitle={`${statistics?.completedToday || 0} tasks completed today`}
          actions={[
            { 
              label: 'Categories', 
              onClick: () => setShowCategoryManager(true), 
              iconName: 'Settings', 
              variant: 'text' 
            },
            { 
              label: 'Add Task', 
              onClick: () => setShowAddModal(true), 
              iconName: 'Plus', 
              variant: 'primary',
              className: 'px-6 py-3'
            }
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="lg:col-span-3 flex flex-col overflow-hidden">
            <TaskFilterBar 
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            <TaskList 
              tasks={filteredTasks}
              getCategoryById={getCategoryById}
              onToggleComplete={handleUpdateTask}
              onEditTask={setSelectedTask}
              onDeleteTask={handleDeleteTask}
              emptyStateProps={{
                searchQuery: filters.searchQuery,
                selectedCategory: filters.selectedCategory,
                selectedPriority: filters.selectedPriority,
                showCompleted: filters.showCompleted,
                onAddTaskClick: () => setShowAddModal(true),
              }}
            />
          </div>

          {/* Statistics Sidebar */}
          {statistics && (
            <StatisticsSection 
              statistics={statistics} 
              getCategoryById={getCategoryById} 
            />
          )}
        </div>
      </div>

      <TaskModal
        isOpen={showAddModal || !!selectedTask}
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

export default TaskDashboard;