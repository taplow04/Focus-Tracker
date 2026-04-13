import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./FocusRooms.css";

const FocusRooms = () => {
  const {
    focusRooms,
    currentFocusRoom,
    joinFocusRoom,
    leaveFocusRoom,
    createFocusRoom,
    user,
    soundSystem,
    playSound,
  } = useApp();

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    duration: "2h",
    sound: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (formData.name && formData.topic) {
      createFocusRoom(formData);
      setFormData({ name: "", topic: "", duration: "2h", sound: null });
      setShowCreateRoom(false);
    }
  };

  const handleJoinRoom = (roomId) => {
    if (currentFocusRoom) {
      leaveFocusRoom();
    }
    joinFocusRoom(roomId);
  };

  return (
    <div className="focus-rooms-container">
      <div className="rooms-header">
        <div>
          <h1>🏫 Focus Rooms</h1>
          <p>Study together anonymously, stay focused individually</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateRoom(!showCreateRoom)}
        >
          {showCreateRoom ? "✕ Cancel" : "+ Create Room"}
        </button>
      </div>

      {/* Create Room Form */}
      {showCreateRoom && (
        <div className="create-room-card card fade-in">
          <h3>Create a Study Room</h3>
          <form onSubmit={handleCreateRoom} className="create-room-form">
            <div className="form-row">
              <div className="form-group">
                <label>Room Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Morning Study Session"
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject/Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g., Physics, Math, Biology"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                >
                  <option value="1h">1 hour</option>
                  <option value="1.5h">1.5 hours</option>
                  <option value="2h">2 hours</option>
                  <option value="3h">3 hours</option>
                  <option value="4h">4 hours</option>
                </select>
              </div>

              <div className="form-group">
                <label>Background Sound</label>
                <select
                  name="sound"
                  value={formData.sound || ""}
                  onChange={handleChange}
                >
                  <option value="">None</option>
                  <option value="rain">🌧️ Rain</option>
                  <option value="whitenoise">🔊 White Noise</option>
                  <option value="library">📚 Library</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success btn-lg btn-block">
              Create & Join Room
            </button>
          </form>
        </div>
      )}

      {/* Current Room Info */}
      {currentFocusRoom && (
        <div className="current-room-card card">
          <div className="current-room-header">
            <div>
              <h3>{currentFocusRoom.name}</h3>
              <p>Topic: {currentFocusRoom.topic}</p>
            </div>
            <button className="btn btn-danger" onClick={leaveFocusRoom}>
              Leave Room
            </button>
          </div>
          <div className="current-room-stats">
            <div className="room-stat">
              <span className="stat-label">Participants</span>
              <span className="stat-value">
                {currentFocusRoom.participants}
              </span>
            </div>
            <div className="room-stat">
              <span className="stat-label">Duration</span>
              <span className="stat-value">{currentFocusRoom.duration}</span>
            </div>
            <div className="room-stat">
              <span className="stat-label">Created By</span>
              <span className="stat-value">{currentFocusRoom.createdBy}</span>
            </div>
            {currentFocusRoom.sound && (
              <div className="room-stat">
                <span className="stat-label">Sound</span>
                <span className="stat-value">{currentFocusRoom.sound}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Rooms List */}
      <div className="rooms-grid">
        <h2>Active Focus Rooms ({focusRooms.length})</h2>
        <div className="rooms-container">
          {focusRooms.map((room) => (
            <div
              key={room.id}
              className={`room-card card ${
                currentFocusRoom?.id === room.id ? "active" : ""
              }`}
            >
              <div className="room-status">
                <span className="status-badge live">● LIVE</span>
              </div>

              <h4>{room.name}</h4>

              <div className="room-meta">
                <div className="meta-item">
                  <span className="meta-label">📚 Topic</span>
                  <span className="meta-value">{room.topic}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">⏱️ Duration</span>
                  <span className="meta-value">{room.duration}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">👥 Participants</span>
                  <span className="meta-value">{room.participants}</span>
                </div>
              </div>

              {room.sound && (
                <div className="sound-badge">
                  {room.sound === "rain" && "🌧️ Rain"}
                  {room.sound === "whitenoise" && "🔊 White Noise"}
                  {room.sound === "library" && "📚 Library"}
                </div>
              )}

              <div className="room-footer">
                <p className="created-by">by {room.createdBy}</p>
                <button
                  className={`btn ${
                    currentFocusRoom?.id === room.id
                      ? "btn-success"
                      : "btn-primary"
                  }`}
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={currentFocusRoom?.id === room.id}
                >
                  {currentFocusRoom?.id === room.id ? "✓ Joined" : "Join"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {focusRooms.length === 0 && (
        <div className="empty-state">
          <p>🏫 No active focus rooms yet.</p>
          <p>Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default FocusRooms;
