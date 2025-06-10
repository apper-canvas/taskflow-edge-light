import React from 'react';
import StatCard from '@/components/molecules/StatCard';
import PropTypes from 'prop-types';

const StatisticsSection = ({ statistics, getCategoryById }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-heading font-semibold text-gray-900">Progress</h2>
      
      {/* Completion Rate */}
      <StatCard
        title="Today's Progress"
        value={`${Math.round(statistics.completionRate)}%`}
        description={`${statistics.completedToday} of ${statistics.totalTasks} tasks completed`}
        progress={statistics.completionRate}
        colorClass="text-primary"
      />
      
      {/* Streak Counter */}
      <StatCard
        title="Current Streak"
        description="Days with completed tasks"
        value={statistics.currentStreak}
        colorClass="text-accent"
        className="flex flex-col"
      >
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
      </StatCard>
      
      {/* Quick Stats */}
      <StatCard
        title="This Week"
        chartData={{
          'Completed': statistics.completedThisWeek,
          'Total Tasks': statistics.totalTasks,
        }}
      />

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
  );
};

StatisticsSection.propTypes = {
  statistics: PropTypes.object.isRequired,
  getCategoryById: PropTypes.func.isRequired,
};

export default StatisticsSection;