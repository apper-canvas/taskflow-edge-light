import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const taskService = {
  async getAll() {
    await delay(300);
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
        ],
        orderBy: [{ fieldName: 'created_at', SortType: 'DESC' }]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  },

  async getById(id) {
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

      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      toast.error("Failed to load task");
      throw error;
    }
  },

  async create(taskData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields
      const updateableData = {
        Name: taskData.title,
        Tags: taskData.tags || '',
        title: taskData.title,
        description: taskData.description || '',
        category_id: taskData.categoryId ? parseInt(taskData.categoryId) : null,
        priority: taskData.priority,
        due_date: taskData.dueDate || null,
        completed: false,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      throw new Error('No results returned');
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      throw error;
    }
  },

  async update(id, updates) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include updateable fields that are being updated
      const updateableData = {
        Id: parseInt(id)
      };

      if (updates.title !== undefined) {
        updateableData.Name = updates.title;
        updateableData.title = updates.title;
      }
      if (updates.description !== undefined) updateableData.description = updates.description;
      if (updates.categoryId !== undefined) updateableData.category_id = updates.categoryId ? parseInt(updates.categoryId) : null;
      if (updates.priority !== undefined) updateableData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateableData.due_date = updates.dueDate;
      if (updates.completed !== undefined) {
        updateableData.completed = updates.completed;
        updateableData.completed_at = updates.completed ? new Date().toISOString() : null;
      }
      updateableData.updated_at = new Date().toISOString();

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      throw new Error('No results returned');
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      throw error;
    }
  },

  async delete(id) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      throw error;
    }
  }
};

export default taskService;