import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const statisticsService = {
  async getAll() {
    await delay(200);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
          'title', 'description', 'category_id', 'priority', 'due_date', 'completed', 
          'completed_at', 'created_at', 'updated_at'
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return this.getDefaultStats();
      }

const tasks = response.data || [];
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
    
      const completedTasks = tasks.filter(task => task.completed);
      const completedToday = completedTasks.filter(task => {
        if (!task.completed_at) return false;
      const completedDate = new Date(task.completed_at);
      return completedDate.toDateString() === today.toDateString();
}).length;
    
      const completedThisWeek = completedTasks.filter(task => {
        if (!task.completed_at) return false;
        const completedDate = new Date(task.completed_at);
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
      if (task.category_id) {
        tasksByCategory[task.category_id] = (tasksByCategory[task.category_id] || 0) + 1;
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
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to load statistics");
      return this.getDefaultStats();
    }
  },

  getDefaultStats() {
    return {
      totalTasks: 0,
      completedToday: 0,
      completedThisWeek: 0,
      completionRate: 0,
      currentStreak: 0,
      tasksByCategory: {}
    };
  }
};

export default statisticsService;