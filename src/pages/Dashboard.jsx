import FocusTimer from "../components/FocusTimer";
import TaskPlanner from "../components/TaskPlanner";
import GoalTracker from "../components/GoalTracker";
import FocusStats from "../components/FocusStats";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container container">
      <div className="dashboard-grid">
        {/* Focus Timer - takes 2 columns on desktop */}
        <div className="grid-item timer-item">
          <FocusTimer />
        </div>

        {/* Goal Tracker */}
        <div className="grid-item goal-item">
          <GoalTracker />
        </div>

        {/* Task Planner - takes 2 columns on desktop */}
        <div className="grid-item tasks-item">
          <TaskPlanner />
        </div>

        {/* Focus Stats - takes 2 columns on desktop */}
        <div className="grid-item stats-item">
          <FocusStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
