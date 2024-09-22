import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationBar = ({ userToken }) => {
  const [dueSoonTasks, setDueSoonTasks] = useState([]);

  useEffect(() => {
    const fetchDueSoonTasks = async () => {
      try {
        const response = await axios.get('/api/tasks/due-soon', {
          headers: {
            Authorization: `Bearer ${userToken}`,  // Pass the JWT token
          },
        });
        setDueSoonTasks(response.data);
      } catch (error) {
        console.error('Error fetching due soon tasks:', error);
      }
    };

    fetchDueSoonTasks();
  }, [userToken]);

  return (
    <div>
      {dueSoonTasks.length > 0 && (
        <div className="notification-bar">
          <p>You have {dueSoonTasks.length} tasks due in the next 24 hours!</p>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
