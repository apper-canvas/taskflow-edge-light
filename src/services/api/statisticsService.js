import { taskService } from '../index.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const statisticsService = {
  async getAll() {
    await delay(200);
    
    const tasks = await taskService.getAll();
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const completedTasks = tasks.filter(task => task.completed);
    const completedToday = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate.toDateString() === today.toDateString();
    }).length;
    
    const completedThisWeek = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate >= weekStart;
    }).length;
    
    const activeTasks = tasks.filter(task => !task.completed);
    const totalActiveTasks = activeTasks.length;
    const completionRate = totalActiveTasks > 0 ? 
      (completedToday / (completedToday + totalActiveTasks)) * 100 : 0;
    
    // Calculate streak (simplified - consecutive days with completed tasks)
    const currentStreak = Math.floor(Math.random() * 7) + 1; // Mock streak
    
    // Task count by category
    const tasksByCategory = {};
    tasks.forEach(task => {
      if (task.categoryId) {
        tasksByCategory[task.categoryId] = (tasksByCategory[task.categoryId] || 0) + 1;
      }
    });
    
    return {
      totalTasks: tasks.length,
      completedToday,
      completedThisWeek,
      completionRate,
      currentStreak,
      tasksByCategory
    };
  }
};

export default statisticsService;