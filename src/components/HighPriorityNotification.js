import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HighPriorityNotification = ({ userToken }) => {
  const [highPriorityTasks, setHighPriorityTasks] = useState([]);

  useEffect(() => {
    const fetchHighPriorityTasks = async () => {
      try {
        const response = await axios.get('/api/tasks/due-soon', {
          headers: {
            Authorization: `Bearer ${userToken}`, // Pass JWT token
          },
        });
        const filteredTasks = response.data.filter(task => task.priority === 'High');
        setHighPriorityTasks(filteredTasks);
      } catch (error) {
        console.error('Error fetching high-priority tasks:', error);
      }
    };

    fetchHighPriorityTasks();
  }, [userToken]);

  return (
    <div>
      {highPriorityTasks.length > 0 && (
        <div className="notification-bar">
          <p>You have {highPriorityTasks.length} high-priority tasks due soon!</p>
        </div>
      )}
    </div>
  );
};

export default HighPriorityNotification;
