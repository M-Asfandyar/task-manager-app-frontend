import React from 'react';

const TaskDependencies = ({ dependencies, canUpdateTask }) => {
  return (
    <div>
      <p>Task Dependencies:</p>
      <ul>
        {dependencies.map((dep) => (
          <li key={dep._id}>
            {dep.title} - {dep.status === 'Completed' ? '✅' : '⏳'}
          </li>
        ))}
      </ul>
      {!canUpdateTask && <p>You cannot update this task until all dependencies are completed.</p>}
    </div>
  );
};

export default TaskDependencies;
