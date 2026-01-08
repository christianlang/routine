import './TaskList.css'

const TaskList = ({ tasks }) => {
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div
          key={index}
          className={`task-item ${task.isActive ? 'active' : ''}`}
          style={{
            borderLeftColor: task.color,
            backgroundColor: task.isActive ? `${task.color}20` : 'transparent'
          }}
        >
          <div className="task-icon">{task.icon}</div>
          <div className="task-info">
            <div className="task-name">{task.name}</div>
            <div className="task-time">
              {task.startTime} ({task.duration} min)
            </div>
          </div>
          {task.isActive && (
            <div className="task-status">
              <span className="status-dot"></span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TaskList
