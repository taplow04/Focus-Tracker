import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./FocusStats.css";

const FocusStats = () => {
  const { sessionsCompleted, dailyFocusTime, tasks, stats, dailyTarget } =
    useApp();
  const [chartType, setChartType] = useState("weekly");

  // Generate mock weekly data for visualization
  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => ({
      day,
      hours: Math.random() * (dailyTarget * 1.2),
      target: dailyTarget,
      sessions: Math.floor(Math.random() * 10) + 1,
    }));
  }, [dailyTarget]);

  // Session breakdown
  const sessionBreakdown = [
    { name: "Focus", value: sessionsCompleted, color: "#6366f1" },
    {
      name: "Breaks",
      value: Math.floor(sessionsCompleted / 4) || 0,
      color: "#10b981",
    },
  ];

  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskStats = [
    { name: "Completed", value: completedTasks, color: "#10b981" },
    { name: "Pending", value: tasks.length - completedTasks, color: "#f59e0b" },
  ];

  // Daily breakdown chart
  const dailyBreakdown = [
    {
      name: "Completed",
      value: completedTasks,
    },
    {
      name: "Pending",
      value: tasks.length - completedTasks,
    },
  ];

  const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
  ];

  const today = new Date().toLocaleDateString();

  return (
    <div className="focus-stats-card card">
      <div className="card-header">
        <h2 className="card-title">📊 Analytics & Stats</h2>
        <div className="chart-tabs">
          <button
            className={`tab-btn ${chartType === "weekly" ? "active" : ""}`}
            onClick={() => setChartType("weekly")}
          >
            Week
          </button>
          <button
            className={`tab-btn ${chartType === "sessions" ? "active" : ""}`}
            onClick={() => setChartType("sessions")}
          >
            Sessions
          </button>
          <button
            className={`tab-btn ${chartType === "tasks" ? "active" : ""}`}
            onClick={() => setChartType("tasks")}
          >
            Tasks
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <p className="metric-label">Today's Focus</p>
            <p className="metric-value">
              {(dailyFocusTime / 3600).toFixed(1)}h
            </p>
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <p className="metric-label">Sessions</p>
            <p className="metric-value">{sessionsCompleted}</p>
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <p className="metric-label">Tasks</p>
            <p className="metric-value">
              {completedTasks}/{tasks.length}
            </p>
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-icon">📅</div>
          <div className="metric-content">
            <p className="metric-label">Streak</p>
            <p className="metric-value">3 days</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        {chartType === "weekly" && (
          <div className="chart-wrapper fade-in">
            <h3 className="chart-title">Weekly Focus Hours</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Study Hours"
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Daily Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === "sessions" && (
          <div className="chart-wrapper fade-in">
            <h3 className="chart-title">Session Breakdown</h3>
            <div className="charts-row">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sessionBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sessionBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="legend-custom">
                {sessionBreakdown.map((item, idx) => (
                  <div key={idx} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="legend-text">
                      <p className="legend-name">{item.name}</p>
                      <p className="legend-value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {chartType === "tasks" && (
          <div className="chart-wrapper fade-in">
            <h3 className="chart-title">Task Completion Status</h3>
            <div className="charts-row">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={8} />
                </BarChart>
              </ResponsiveContainer>
              <div className="legend-custom">
                {taskStats.map((item, idx) => (
                  <div key={idx} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="legend-text">
                      <p className="legend-name">{item.name}</p>
                      <p className="legend-value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date Info */}
      <div className="stats-footer">
        <p>
          <strong>Last Updated:</strong> {today}
        </p>
      </div>
    </div>
  );
};

export default FocusStats;
