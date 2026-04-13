import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import "./FocusTimer.css";

const FocusTimer = () => {
  const {
    timeLeft,
    setTimeLeft,
    focusTime,
    setFocusTime,
    isRunning,
    setIsRunning,
    breakTime,
    setBreakTime,
    isBreak,
    setIsBreak,
    sessionsCompleted,
    setSessionsCompleted,
    dailyFocusTime,
    setDailyFocusTime,
  } = useApp();

  const [customMinutes, setCustomMinutes] = useState(25);
  const [showSettings, setShowSettings] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      if (isBreak) {
        // Break finished, start new focus session
        setIsBreak(false);
        setTimeLeft(focusTime);
      } else {
        // Focus session finished, start break
        setSessionsCompleted(sessionsCompleted + 1);
        setDailyFocusTime(dailyFocusTime + focusTime);
        setIsBreak(true);
        setTimeLeft(breakTime);
        playNotification();
      }
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    isBreak,
    focusTime,
    breakTime,
    sessionsCompleted,
    dailyFocusTime,
  ]);

  const playNotification = () => {
    // Simple notification sound
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? breakTime : focusTime);
  };

  const handleSkip = () => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(focusTime);
    } else {
      setSessionsCompleted(sessionsCompleted + 1);
      setDailyFocusTime(dailyFocusTime + focusTime);
      setIsBreak(true);
      setTimeLeft(breakTime);
    }
    setIsRunning(false);
  };

  const handleCustomFocus = () => {
    const minutes = parseInt(customMinutes) || 25;
    const seconds = minutes * 60;
    setFocusTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setShowSettings(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = isBreak
    ? ((breakTime - timeLeft) / breakTime) * 100
    : ((focusTime - timeLeft) / focusTime) * 100;

  return (
    <div className="focus-timer-card card">
      <div className="card-header">
        <h2 className="card-title">⏱️ Smart Focus Timer</h2>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="timer-settings fade-in">
          <div className="settings-group">
            <label>Focus Duration (minutes):</label>
            <div className="input-group">
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                min="1"
                max="120"
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCustomFocus}
              >
                Apply
              </button>
            </div>
          </div>
          <div className="settings-group">
            <label>Break Duration: {Math.floor(breakTime / 60)} min</label>
            <input
              type="range"
              min="60"
              max="1800"
              step="60"
              value={breakTime}
              onChange={(e) => setBreakTime(parseInt(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="timer-display">
        <div
          className={`timer-circle ${isBreak ? "break-mode" : "focus-mode"}`}
        >
          <div
            className="circular-progress"
            style={{
              background: `conic-gradient(var(--primary-color) ${progressPercent}%, rgba(99, 102, 241, 0.1) ${progressPercent}%)`,
            }}
          >
            <div className="timer-content">
              <div className="timer-time">{formatTime(timeLeft)}</div>
              <div className="timer-label">
                {isBreak ? "Break Time" : "Focus Time"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="timer-stats">
        <div className="stat">
          <span className="stat-label">Sessions</span>
          <span className="stat-value">{sessionsCompleted}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Today</span>
          <span className="stat-value">
            {(dailyFocusTime / 3600).toFixed(1)}h
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="timer-controls">
        <button
          className={`btn ${isRunning ? "btn-danger" : "btn-success"} btn-lg`}
          onClick={handleStartPause}
        >
          {isRunning ? "⏸️ Pause" : "▶️ Start"}
        </button>
        <button className="btn btn-outline btn-lg" onClick={handleReset}>
          🔄 Reset
        </button>
        <button className="btn btn-outline btn-lg" onClick={handleSkip}>
          ⏭️ Skip
        </button>
      </div>

      {/* Status Indicator */}
      <div className={`timer-status ${isRunning ? "running" : ""}`}>
        {isRunning && <span className="pulse"></span>}
        <span>{isRunning ? "Timer Running..." : "Timer Paused"}</span>
      </div>
    </div>
  );
};

export default FocusTimer;
