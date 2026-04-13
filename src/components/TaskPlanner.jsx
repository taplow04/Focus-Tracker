import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./TaskPlanner.css";

const TaskPlanner = () => {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useApp();
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleAddTask = () => {
    if (!input.trim()) return;
    addTask({ title: input, priority });
    setInput("");
    setPriority("medium");
    setShowForm(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  return (
    <div className="task-planner-card card">
      <div className="card-header">
        <div>
          <h2 className="card-title">✅ Task Checklist</h2>
          <p className="card-subtitle">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕" : "+ Add Task"}
        </button>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="task-progress-container">
          <div className="task-progress-bar">
            <div
              className="task-progress-fill"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
          <span className="task-progress-text">
            {Math.round((completedCount / totalCount) * 100)}% Complete
          </span>
        </div>
      )}

      {/* Add Task Form */}
      {showForm && (
        <div className="task-form fade-in">
          <div className="form-inputs">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What do you need to do?"
              className="task-input"
              autoFocus
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="form-buttons">
            <button className="btn btn-success" onClick={handleAddTask}>
              Add Task
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="task-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({tasks.length})
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Done ({completedCount})
        </button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === "all" && "No tasks yet. Add one to get started! 🚀"}
              {filter === "pending" && "All tasks completed! Great job! 🎉"}
              {filter === "completed" && "No completed tasks yet."}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="task-checkbox"
                />
              </div>
              <div className="task-content">
                <label className="task-title">
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      opacity: task.completed ? 0.6 : 1,
                    }}
                  >
                    {task.title}
                  </span>
                </label>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
              </div>
              <div
                className={`priority-badge ${getPriorityColor(task.priority)}`}
              >
                {task.priority.charAt(0).toUpperCase()}
              </div>
              <button
                className="btn-delete"
                onClick={() => deleteTask(task.id)}
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskPlanner;
