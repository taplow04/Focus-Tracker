import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User & Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved
      ? JSON.parse(saved)
      : {
          id: null,
          name: "Guest",
          email: "",
          isLoggedIn: false,
          createdAt: null,
        };
  });

  // Focus Score System
  const [focusScore, setFocusScore] = useState(() => {
    const saved = localStorage.getItem("focusScore");
    return saved
      ? JSON.parse(saved)
      : {
          totalScore: 0,
          dailyScore: 0,
          weeklyScore: 0,
          streak: 0,
          bestStreak: 0,
          lastSessionScore: 0,
          scoreMultiplier: 1,
        };
  });

  // Tab/Window Visibility Detection for Distractions
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(() => {
    const saved = localStorage.getItem("tabSwitchCount");
    return saved ? parseInt(saved) : 0;
  });

  // Sound System State
  const [soundSystem, setSoundSystem] = useState(() => {
    const saved = localStorage.getItem("soundSystem");
    return saved
      ? JSON.parse(saved)
      : {
          isPlaying: false,
          currentSound: null, // "rain", "whitenoise", "library", null
          volume: 50,
          soundsList: [
            {
              id: "rain",
              name: "🌧️ Rain Sounds",
              description: "Calming rain ambience",
            },
            {
              id: "whitenoise",
              name: "🔊 White Noise",
              description: "Pure white noise",
            },
            {
              id: "library",
              name: "📚 Library Ambient",
              description: "Peaceful library sounds",
            },
          ],
        };
  });

  // Focus Rooms State
  const [focusRooms, setFocusRooms] = useState(() => {
    const saved = localStorage.getItem("focusRooms");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Morning Study Session",
            topic: "Physics",
            participants: 12,
            status: "active",
            duration: "2h",
            createdBy: "Alex",
            sound: "whitenoise",
          },
          {
            id: 2,
            name: "Biology Prep Group",
            topic: "Biology",
            participants: 8,
            status: "active",
            duration: "1.5h",
            createdBy: "Sarah",
            sound: "library",
          },
          {
            id: 3,
            name: "Math Problem Solving",
            topic: "Mathematics",
            participants: 15,
            status: "active",
            duration: "3h",
            createdBy: "John",
            sound: "rain",
          },
        ];
  });

  const [currentFocusRoom, setCurrentFocusRoom] = useState(() => {
    const saved = localStorage.getItem("currentFocusRoom");
    return saved ? JSON.parse(saved) : null;
  });

  // Focus Timer State - Declare BEFORE useEffect that uses isRunning
  const [focusTime, setFocusTime] = useState(() => {
    const saved = localStorage.getItem("focusTime");
    return saved ? parseInt(saved) : 25 * 60; // 25 minutes in seconds
  });

  const [timeLeft, setTimeLeft] = useState(focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    const saved = localStorage.getItem("sessionsCompleted");
    return saved ? parseInt(saved) : 0;
  });
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [dailyFocusTime, setDailyFocusTime] = useState(() => {
    const saved = localStorage.getItem("dailyFocusTime");
    return saved ? parseInt(saved) : 0;
  });

  // Distractions Tracking - Declare BEFORE useEffect that uses addDistraction
  const [distractions, setDistractions] = useState(() => {
    const saved = localStorage.getItem("distractions");
    return saved ? JSON.parse(saved) : [];
  });

  // Helper function for adding distractions
  const addDistraction = (distraction) => {
    const newDistraction = {
      id: Date.now(),
      reason: distraction,
      timestamp: new Date().toISOString(),
    };
    setDistractions((prev) => [...prev, newDistraction]);
  };

  // Tab Visibility Detection - Track when user leaves the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);

      // Track tab switches only when focused on timer
      if (!isVisible && isRunning) {
        setTabSwitchCount((prev) => prev + 1);
        addDistraction("Tab switched away during focus");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning]);

  // Tasks State
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // Daily Target State
  const [dailyTarget, setDailyTarget] = useState(() => {
    const saved = localStorage.getItem("dailyTarget");
    return saved ? parseInt(saved) : 8; // 8 hours target
  });

  // Exam Tracking State
  const [exam, setExam] = useState(() => {
    const saved = localStorage.getItem("exam");
    return saved ? JSON.parse(saved) : { name: "", date: "", description: "" };
  });

  // Statistics State
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("stats");
    return saved
      ? JSON.parse(saved)
      : {
          totalFocusTime: 0,
          totalSessions: 0,
          totalTasksCompleted: 0,
          weeklyData: {},
          dailyHistory: [],
        };
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved
      ? JSON.parse(saved)
      : {
          soundEnabled: true,
          notificationsEnabled: true,
          theme: "dark",
          focusDuration: 25,
          breakDuration: 5,
        };
  });

  // Persist to localStorage whenever states change
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("focusTime", focusTime.toString());
  }, [focusTime]);

  useEffect(() => {
    localStorage.setItem("sessionsCompleted", sessionsCompleted.toString());
  }, [sessionsCompleted]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("dailyTarget", dailyTarget.toString());
  }, [dailyTarget]);

  useEffect(() => {
    localStorage.setItem("exam", JSON.stringify(exam));
  }, [exam]);

  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("focusScore", JSON.stringify(focusScore));
  }, [focusScore]);

  useEffect(() => {
    localStorage.setItem("soundSystem", JSON.stringify(soundSystem));
  }, [soundSystem]);

  useEffect(() => {
    localStorage.setItem("focusRooms", JSON.stringify(focusRooms));
  }, [focusRooms]);

  useEffect(() => {
    localStorage.setItem("currentFocusRoom", JSON.stringify(currentFocusRoom));
  }, [currentFocusRoom]);

  useEffect(() => {
    localStorage.setItem("tabSwitchCount", tabSwitchCount.toString());
  }, [tabSwitchCount]);

  // Helper functions
  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      title: task.title,
      description: task.description || "",
      completed: false,
      createdAt: new Date().toISOString(),
      priority: task.priority || "medium",
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const updateTask = (taskId, updates) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    );
  };

  const resetDailyStats = () => {
    setDailyFocusTime(0);
    setSessionsCompleted(0);
    setTasks(tasks.map((task) => ({ ...task, completed: false })));
  };

  const getDaysUntilExam = () => {
    if (!exam.date) return null;
    const examDate = new Date(exam.date);
    const today = new Date();
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Focus Score System Functions
  const calculateSessionScore = (focusMinutes, tabSwitches) => {
    // Base score: 1 point per minute
    let baseScore = Math.floor(focusMinutes / 5); // 5 points per 5 minutes

    // Deduction for tab switches
    const switchPenalty = tabSwitches * 5;

    // Bonus for long sessions
    let bonus = 0;
    if (focusMinutes >= 25) bonus += 10;
    if (focusMinutes >= 45) bonus += 15;
    if (focusMinutes >= 90) bonus += 25;

    const finalScore = Math.max(0, baseScore - switchPenalty + bonus);
    return Math.round(finalScore * focusScore.scoreMultiplier);
  };

  const updateFocusScore = (sessionMinutes) => {
    const sessionScore = calculateSessionScore(sessionMinutes, tabSwitchCount);
    setFocusScore((prev) => ({
      ...prev,
      totalScore: prev.totalScore + sessionScore,
      dailyScore: prev.dailyScore + sessionScore,
      weeklyScore: prev.weeklyScore + sessionScore,
      lastSessionScore: sessionScore,
    }));
    setTabSwitchCount(0); // Reset tab switches for new session
  };

  const updateStreak = () => {
    setFocusScore((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      bestStreak: Math.max(prev.streak + 1, prev.bestStreak),
    }));
  };

  // Authentication Functions
  const login = (name, email) => {
    const newUser = {
      id: Date.now(),
      name,
      email,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const signup = (name, email) => {
    const newUser = {
      id: Date.now(),
      name,
      email,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser({
      id: null,
      name: "Guest",
      email: "",
      isLoggedIn: false,
      createdAt: null,
    });
  };

  // Sound System Functions
  const playSound = (soundId) => {
    setSoundSystem((prev) => ({
      ...prev,
      isPlaying: true,
      currentSound: soundId,
    }));
  };

  const stopSound = () => {
    setSoundSystem((prev) => ({
      ...prev,
      isPlaying: false,
      currentSound: null,
    }));
  };

  const setVolume = (level) => {
    setSoundSystem((prev) => ({
      ...prev,
      volume: Math.min(100, Math.max(0, level)),
    }));
  };

  // Focus Rooms Functions
  const joinFocusRoom = (roomId) => {
    const room = focusRooms.find((r) => r.id === roomId);
    if (room) {
      setCurrentFocusRoom({
        ...room,
        joinedAt: new Date().toISOString(),
      });
      // Optionally play the room's sound
      if (room.sound && soundSystem.soundEnabled) {
        playSound(room.sound);
      }
    }
  };

  const leaveFocusRoom = () => {
    stopSound();
    setCurrentFocusRoom(null);
  };

  const createFocusRoom = (roomData) => {
    const newRoom = {
      id: focusRooms.length + 1,
      name: roomData.name,
      topic: roomData.topic,
      participants: 1,
      status: "active",
      duration: roomData.duration || "2h",
      createdBy: user.name || "Anonymous",
      sound: roomData.sound || null,
      createdAt: new Date().toISOString(),
    };
    setFocusRooms([...focusRooms, newRoom]);
    joinFocusRoom(newRoom.id);
    return newRoom;
  };

  const value = {
    // User & Auth
    user,
    setUser,
    login,
    signup,
    logout,

    // Focus Timer
    focusTime,
    setFocusTime,
    timeLeft,
    setTimeLeft,
    isRunning,
    setIsRunning,
    sessionsCompleted,
    setSessionsCompleted,
    breakTime,
    setBreakTime,
    isBreak,
    setIsBreak,
    dailyFocusTime,
    setDailyFocusTime,

    // Focus Score
    focusScore,
    setFocusScore,
    calculateSessionScore,
    updateFocusScore,
    updateStreak,

    // Tab Switching
    isPageVisible,
    setIsPageVisible,
    tabSwitchCount,
    setTabSwitchCount,

    // Sound System
    soundSystem,
    setSoundSystem,
    playSound,
    stopSound,
    setVolume,

    // Focus Rooms
    focusRooms,
    setFocusRooms,
    currentFocusRoom,
    setCurrentFocusRoom,
    joinFocusRoom,
    leaveFocusRoom,
    createFocusRoom,

    // Tasks
    tasks,
    setTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,

    // Daily Target
    dailyTarget,
    setDailyTarget,

    // Exam
    exam,
    setExam,
    getDaysUntilExam,

    // Statistics
    stats,
    setStats,

    // Distractions
    distractions,
    addDistraction,

    // Settings
    settings,
    setSettings,

    // Utilities
    resetDailyStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
