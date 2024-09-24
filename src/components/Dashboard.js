import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    tasksByCategory: [],
    completionRate: 0,
    upcomingTasks: [],
    overdueTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/analytics/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        });
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task analytics:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>Task Analytics Dashboard</h1>

      {/* Task Completion Rate */}
      <div>
        <h3>Task Completion Rate</h3>
        <p>{stats.completionRate.toFixed(2)}%</p>
      </div>

      {/* Tasks by Category */}
      <div>
        <h3>Tasks by Category</h3>
        <ul>
          {stats.tasksByCategory.map((category) => (
            <li key={category._id}>{category._id}: {category.total}</li>
          ))}
        </ul>
      </div>

      {/* Upcoming Tasks */}
      <div>
        <h3>Upcoming Tasks</h3>
        <ul>
          {stats.upcomingTasks.map((task) => (
            <li key={task._id}>{task.title} - Due: {new Date(task.dueDate).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>

      {/* Overdue Tasks */}
      <div>
        <h3>Overdue Tasks</h3>
        <ul>
          {stats.overdueTasks.map((task) => (
            <li key={task._id}>{task.title} - Due: {new Date(task.dueDate).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
