import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./GoalTracker.css";

const GoalTracker = () => {
  const {
    exam,
    setExam,
    dailyTarget,
    setDailyTarget,
    dailyFocusTime,
    getDaysUntilExam,
  } = useApp();
  const [showExamForm, setShowExamForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const daysLeft = getDaysUntilExam();
  const focusPercent = Math.min(
    (dailyFocusTime / 3600 / dailyTarget) * 100,
    100,
  );
  const hoursToday = (dailyFocusTime / 3600).toFixed(2);

  const handleSetExam = (e) => {
    e.preventDefault();
    setShowExamForm(false);
  };

  const handleSetGoal = (goalHours) => {
    setDailyTarget(goalHours);
    setShowGoalForm(false);
  };

  const removalDaysToStudy = daysLeft
    ? Math.ceil((daysLeft * dailyTarget) / 7)
    : 0;

  return (
    <div className="goal-tracker-card card">
      <div className="card-header">
        <h2 className="card-title">🎯 Goals & Targets</h2>
      </div>

      <div className="goal-sections">
        {/* Daily Target Section */}
        <div className="goal-section">
          <div className="section-header">
            <h3>📋 Daily Focus Target</h3>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setShowGoalForm(!showGoalForm)}
            >
              {showGoalForm ? "✕" : "Edit"}
            </button>
          </div>

          {showGoalForm && (
            <div className="goal-form fade-in">
              <p className="form-label">Set your daily study goal:</p>
              <div className="goal-buttons">
                {[2, 4, 6, 8, 10, 12].map((hours) => (
                  <button
                    key={hours}
                    className={`goal-btn ${dailyTarget === hours ? "active" : ""}`}
                    onClick={() => handleSetGoal(hours)}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
              <div className="custom-goal">
                <input
                  type="number"
                  placeholder="Custom hours"
                  min="1"
                  max="24"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > 0) setDailyTarget(val);
                  }}
                  value={dailyTarget}
                />
              </div>
            </div>
          )}

          <div className="goal-stats">
            <div className="stat-box">
              <span className="stat-label">Today's Progress</span>
              <span className="stat-value">
                {hoursToday}h / {dailyTarget}h
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${focusPercent}%` }}
              ></div>
            </div>
            <span className="progress-percent">
              {Math.round(focusPercent)}%
            </span>
          </div>

          <div className="remaining-info">
            {dailyTarget > parseInt(hoursToday) ? (
              <p>
                <strong>
                  {(dailyTarget - parseFloat(hoursToday)).toFixed(2)}h
                </strong>{" "}
                remaining to reach your goal today
              </p>
            ) : (
              <p className="goal-achieved">
                ✨ Goal achieved! Keep studying for extra progress.
              </p>
            )}
          </div>
        </div>

        {/* Exam Section */}
        <div className="goal-section">
          <div className="section-header">
            <h3>📚 Exam Preparation</h3>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setShowExamForm(!showExamForm)}
            >
              {exam.name ? "Edit" : "Add Exam"}
            </button>
          </div>

          {showExamForm && (
            <form className="exam-form fade-in" onSubmit={handleSetExam}>
              <div className="form-group">
                <label>Exam Name:</label>
                <input
                  type="text"
                  placeholder="e.g., Physics Final Exam"
                  value={exam.name}
                  onChange={(e) => setExam({ ...exam, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Exam Date:</label>
                <input
                  type="date"
                  value={exam.date}
                  onChange={(e) => setExam({ ...exam, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description (Optional):</label>
                <textarea
                  placeholder="Add notes about this exam..."
                  value={exam.description || ""}
                  onChange={(e) =>
                    setExam({ ...exam, description: e.target.value })
                  }
                  rows="3"
                ></textarea>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-success">
                  Save Exam
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowExamForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {exam.name ? (
            <div className="exam-info-box">
              <h4>{exam.name}</h4>
              {exam.date && (
                <div className="exam-detail">
                  <span className="detail-label">Exam Date:</span>
                  <span className="detail-value">
                    {new Date(exam.date).toLocaleDateString()}
                  </span>
                </div>
              )}
              {daysLeft !== null && (
                <div className="exam-detail countdown">
                  <span className="detail-label">Days Left:</span>
                  <span
                    className={`detail-value ${daysLeft <= 7 ? "urgent" : daysLeft <= 30 ? "warning" : "normal"}`}
                  >
                    {daysLeft === 0 ? "Today! 🎉" : `${daysLeft} days`}
                  </span>
                </div>
              )}
              {exam.description && (
                <div className="exam-detail">
                  <p className="detail-description">{exam.description}</p>
                </div>
              )}
              <div className="exam-recommendation">
                <p>
                  <strong>Study Plan:</strong> At {dailyTarget}h/day, you have{" "}
                  <strong>{removalDaysToStudy} days</strong> equivalent of study
                  time available.
                </p>
              </div>
            </div>
          ) : (
            <div className="no-exam-state">
              <p>No exam added yet.</p>
              <p className="hint">Add an exam to track your preparation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;
