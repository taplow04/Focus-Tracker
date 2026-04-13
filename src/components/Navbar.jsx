import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const {
    user,
    exam,
    getDaysUntilExam,
    dailyFocusTime,
    dailyTarget,
    logout,
    focusScore,
    tabSwitchCount,
  } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const daysLeft = getDaysUntilExam();
  const focusPercent = Math.min(
    (dailyFocusTime / 3600 / dailyTarget) * 100,
    100,
  );

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/login");
  };

  const navigateAndCloseSidebar = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            {/* Logo & Branding */}
            <div className="navbar-brand">
              <div className="logo-icon">🎯</div>
              <div>
                <h1 className="logo-text">FocusFlow</h1>
                <p className="logo-subtitle">Master Your Study</p>
              </div>
            </div>

            {/* Hamburger Menu (Mobile Only) */}
            <button
              className={`hamburger-menu ${sidebarOpen ? "active" : ""}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Center - Exam Countdown (if exam is set) */}
            {exam.name && (
              <div className="navbar-exam-info">
                <div className="exam-badge">
                  <span className="exam-label">📚 Exam:</span>
                  <span className="exam-name">{exam.name}</span>
                  {daysLeft !== null && (
                    <span
                      className={`exam-days ${daysLeft <= 7 ? "urgent" : daysLeft <= 30 ? "warning" : "normal"}`}
                    >
                      {daysLeft === 0 ? "Today!" : `${daysLeft} days left`}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Right - User & Daily Progress */}
            <div className="navbar-right">
              {/* Daily Progress */}
              <div className="daily-progress">
                <div className="progress-label">
                  <span className="progress-text">
                    Daily Goal: {(dailyFocusTime / 3600).toFixed(1)}h /{" "}
                    {dailyTarget}h
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${focusPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* User Stats */}
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-label">Score:</span>
                  <span className="stat-value">
                    {focusScore.totalScore} pts
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Distractions:</span>
                  <span className="stat-value">{tabSwitchCount}</span>
                </div>
              </div>

              {/* User Navigation */}
              <div className="user-nav">
                <button
                  className="nav-button"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className="nav-button"
                  onClick={() => navigate("/rooms")}
                >
                  Focus Rooms
                </button>
              </div>

              {/* User Info & Logout */}
              <div className="user-section">
                <div className="user-profile">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user.name}</span>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`mobile-sidebar ${sidebarOpen ? "open" : ""}`}
      >
        {/* Close Button */}
        <button
          className="sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Sidebar Header with User Info */}
        <div className="sidebar-header">
          <div className="sidebar-user-profile">
            <div className="sidebar-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <h3 className="sidebar-user-name">{user.name}</h3>
              <p className="sidebar-user-email">Student</p>
            </div>
          </div>
        </div>

        {/* Exam Info in Sidebar */}
        {exam.name && (
          <div className="sidebar-exam-section">
            <div className="sidebar-exam-badge">
              <span className="sidebar-exam-label">📚 {exam.name}</span>
              {daysLeft !== null && (
                <span
                  className={`sidebar-exam-days ${daysLeft <= 7 ? "urgent" : daysLeft <= 30 ? "warning" : "normal"}`}
                >
                  {daysLeft === 0 ? "Today!" : `${daysLeft} days`}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Daily Progress in Sidebar */}
        <div className="sidebar-progress-section">
          <p className="sidebar-progress-label">
            Daily Goal: {(dailyFocusTime / 3600).toFixed(1)}h / {dailyTarget}h
          </p>
          <div className="sidebar-progress-bar-container">
            <div
              className="sidebar-progress-bar"
              style={{ width: `${focusPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Stats in Sidebar */}
        <div className="sidebar-stats">
          <div className="sidebar-stat-item">
            <span className="sidebar-stat-label">Score</span>
            <span className="sidebar-stat-value">
              {focusScore.totalScore} pts
            </span>
          </div>
          <div className="sidebar-stat-item">
            <span className="sidebar-stat-label">Distractions</span>
            <span className="sidebar-stat-value">{tabSwitchCount}</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          <button
            className="sidebar-nav-item"
            onClick={() => navigateAndCloseSidebar("/dashboard")}
          >
            <span className="sidebar-nav-icon">📊</span>
            <span className="sidebar-nav-text">Dashboard</span>
          </button>
          <button
            className="sidebar-nav-item"
            onClick={() => navigateAndCloseSidebar("/rooms")}
          >
            <span className="sidebar-nav-icon">🚀</span>
            <span className="sidebar-nav-text">Focus Rooms</span>
          </button>
        </nav>

        {/* Logout Button in Sidebar */}
        <button className="sidebar-logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
