import React, { useState, useEffect, useCallback } from 'react';
import NotificationBar from './components/NotificationBar';
import HighPriorityNotification from './components/HighPriorityNotification';
import TaskProgress from './components/TaskProgress';  // For progress tracking
import TaskDependencies from './components/TaskDependencies';  // For task dependencies

// Import Firebase functions for FCM
import { requestFirebaseNotificationPermission, onMessageListener } from './firebase';  // Make sure firebase.js is set up

const App = () => {
  const [userToken, setUserToken] = useState('');
  const [tasks, setTasks] = useState([]);  // Store tasks
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);  // State to store FCM notifications

  // Function to retrieve tasks from the backend
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: {
          Authorization: `Bearer ${userToken}`,  // Pass JWT token for authentication
        },
      });
      const data = await response.json();
      setTasks(data);  // Store tasks in state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  }, [userToken]);  // Depend on userToken

  // On component mount, fetch the tasks and request notification permission
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');  // Retrieve JWT token from local storage
    if (token) {
      setUserToken(token);
    }
    if (userToken) {
      fetchTasks();  // Fetch tasks if user is authenticated
    }

    // Request permission for notifications
    requestFirebaseNotificationPermission()
      .then((fcmToken) => {
        console.log('FCM Token:', fcmToken);
        // Save FCM token to backend (if needed)
      })
      .catch((err) => {
        console.error('Unable to get permission for notifications:', err);
      });

    // Listen for incoming messages
    onMessageListener()
      .then((payload) => {
        console.log('Message received: ', payload);
        setNotification(payload.notification);  // Store the notification
      })
      .catch((err) => console.error('Failed to receive message: ', err));
  }, [userToken, fetchTasks]);

  // Function to update task progress
  const updateTaskProgress = async (taskId, newProgress) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/progress`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress: newProgress }),
      });
      const updatedTask = await response.json();
      // Update the task in the local state
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error updating task progress:', error);
    }
  };

  // Function to check if task can be updated based on dependencies
  const canUpdateTask = (dependencies) => {
    return dependencies.every((dep) => dep.status === 'Completed');
  };

  return (
    <div>
      {userToken && <NotificationBar userToken={userToken} />}
      {userToken && <HighPriorityNotification userToken={userToken} />}
      
      {/* Display the received FCM notification */}
      {notification && (
        <div className="notification">
          <h2>New Notification</h2>
          <p>{notification.title}</p>
          <p>{notification.body}</p>
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <div key={task._id}>
              <h3>{task.title}</h3>
              <TaskProgress
                progress={task.progress}
                taskId={task._id}
                updateProgress={updateTaskProgress}
              />
              <TaskDependencies
                dependencies={task.dependencies}
                canUpdateTask={canUpdateTask(task.dependencies)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
