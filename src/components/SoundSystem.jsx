import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import "./SoundSystem.css";

const SoundSystem = () => {
  const { soundSystem, playSound, stopSound, setVolume } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const filterRef = useRef(null);

  // Initialize Web Audio API
  const initAudioContext = () => {
    if (audioContextRef.current) return audioContextRef.current;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const audioContext = new AudioCtx();
    audioContextRef.current = audioContext;
    return audioContext;
  };

  // Mobile browsers (especially iOS Safari) start the AudioContext in a
  // "suspended" state. It can only be resumed in response to a user gesture,
  // otherwise no sound will play even though everything is wired up.
  const resumeAudioContext = (audioContext) => {
    if (audioContext && audioContext.state === "suspended") {
      const resumePromise = audioContext.resume();
      if (resumePromise && typeof resumePromise.catch === "function") {
        resumePromise.catch(() => {
          // Ignore — will retry on next user interaction
        });
      }
    }
  };

  // Generate white noise
  const createWhiteNoise = (audioContext) => {
    const bufferSize = audioContext.sampleRate * 2;
    const noiseBuffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate,
    );
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    return noiseSource;
  };

  // Play specific sound
  useEffect(() => {
    if (!soundSystem.isPlaying) {
      // Stop all sounds
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        oscillatorRef.current = null;
        gainNodeRef.current = null;
        noiseNodeRef.current = null;
        filterRef.current = null;
      }
      return;
    }

    const audioContext = initAudioContext();
    if (!audioContext) return;
    resumeAudioContext(audioContext);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = soundSystem.volume / 100;
    gainNodeRef.current = gainNode;
    gainNode.connect(audioContext.destination);

    if (soundSystem.currentSound === "whitenoise") {
      // White noise
      const noiseSource = createWhiteNoise(audioContext);
      noiseSource.connect(gainNode);
      noiseSource.start(0);
      noiseNodeRef.current = noiseSource;
    } else if (soundSystem.currentSound === "rain") {
      // Rain: filtered white noise with lower frequencies
      const noiseSource = createWhiteNoise(audioContext);
      const filter = audioContext.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;
      filter.Q.value = 1;
      filterRef.current = filter;

      noiseSource.connect(filter);
      filter.connect(gainNode);
      noiseSource.start(0);
      noiseNodeRef.current = noiseSource;
    } else if (soundSystem.currentSound === "library") {
      // Library: soft ambient with brownian noise (low pass filtered pink noise)
      const noiseSource = createWhiteNoise(audioContext);
      const filter = audioContext.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 200;
      filter.Q.value = 0.5;
      filterRef.current = filter;

      noiseSource.connect(filter);
      filter.connect(gainNode);
      noiseSource.start(0);
      noiseNodeRef.current = noiseSource;
    }

    return () => {
      // Cleanup on unmount or stop
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }
    };
  }, [soundSystem.isPlaying, soundSystem.currentSound]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = soundSystem.volume / 100;
    }
  }, [soundSystem.volume]);

  const getSoundIcon = (soundId) => {
    switch (soundId) {
      case "rain":
        return "🌧️";
      case "whitenoise":
        return "🔊";
      case "library":
        return "📚";
      default:
        return "🎵";
    }
  };

  const getSoundName = (soundId) => {
    const sound = soundSystem.soundsList.find((s) => s.id === soundId);
    return sound ? sound.name : "Sound";
  };

  // Unlock audio playback on iOS/mobile by creating and resuming the
  // AudioContext inside the same user-gesture call stack. Without this,
  // the context can stay suspended and produce silence.
  const handleSoundButtonClick = (soundId) => {
    const audioContext = initAudioContext();
    resumeAudioContext(audioContext);
    playSound(soundId);
  };

  const handleTogglePanel = () => {
    if (!isExpanded) {
      const audioContext = initAudioContext();
      resumeAudioContext(audioContext);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sound-system ${isExpanded ? "expanded" : ""}`}>
      {/* Floating Button */}
      <button
        className="sound-toggle-btn"
        onClick={handleTogglePanel}
        title="Sound System"
      >
        {soundSystem.isPlaying ? "🔊" : "🔇"}
      </button>

      {/* Panel */}
      <div className={`sound-panel ${isExpanded ? "visible" : ""}`}>
        <div className="panel-header">
          <h3>🎵 Ambient Sounds</h3>
          <button className="close-btn" onClick={() => setIsExpanded(false)}>
            ×
          </button>
        </div>

        {/* Current Playing */}
        {soundSystem.isPlaying && (
          <div className="current-sound">
            <div className="now-playing">
              <span className="playing-icon">▶</span>
              <div>
                <p className="playing-label">Now Playing</p>
                <p className="playing-name">
                  {getSoundIcon(soundSystem.currentSound)}{" "}
                  {getSoundName(soundSystem.currentSound)}
                </p>
              </div>
            </div>
            <button className="stop-btn" onClick={stopSound} title="Stop sound">
              ⏹️
            </button>
          </div>
        )}

        {/* Volume Control */}
        <div className="volume-control">
          <label>Volume</label>
          <div className="volume-slider-wrapper">
            <span className="volume-icon">🔇</span>
            <input
              type="range"
              min="0"
              max="100"
              value={soundSystem.volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="volume-slider"
              disabled={!soundSystem.isPlaying}
            />
            <span className="volume-icon">🔊</span>
          </div>
          <p className="volume-value">{soundSystem.volume}%</p>
        </div>

        {/* Sounds List */}
        <div className="sounds-list">
          <p className="list-label">Available Sounds</p>
          <div className="sounds-grid">
            {soundSystem.soundsList.map((sound) => (
              <button
                key={sound.id}
                className={`sound-btn ${
                  soundSystem.currentSound === sound.id && soundSystem.isPlaying
                    ? "active"
                    : ""
                }`}
                onClick={() => handleSoundButtonClick(sound.id)}
                title={sound.description}
              >
                <div className="sound-btn-icon">{sound.name.split(" ")[0]}</div>
                <div className="sound-btn-label">
                  {sound.name.split(" ").slice(1).join(" ")}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="sound-info">
          <p>
            <strong>💡 Pro Tip:</strong> Ambient sounds can help improve focus
            and reduce distractions. Find what works best for you!
          </p>
        </div>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="sound-backdrop"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}
    </div>
  );
};

export default SoundSystem;
