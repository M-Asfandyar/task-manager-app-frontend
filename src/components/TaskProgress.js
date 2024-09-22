import React from 'react';

const TaskProgress = ({ progress, taskId, updateProgress }) => {
  const handleProgressChange = (e) => {
    updateProgress(taskId, e.target.value);
  };

  return (
    <div>
      <p>Progress: {progress}%</p>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleProgressChange}
      />
    </div>
  );
};

export default TaskProgress;
