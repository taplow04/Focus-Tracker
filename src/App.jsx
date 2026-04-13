import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import FocusRooms from "./pages/FocusRooms";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import SoundSystem from "./components/SoundSystem";
import "./styles/global.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  if (!user.isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Main App Layout with Navigation
const AppLayout = ({ children }) => {
  const { user } = useApp();

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {user.isLoggedIn && <Navbar />}
      <main style={{ flex: 1, padding: user.isLoggedIn ? "2rem 0" : "0" }}>
        {children}
      </main>
      {user.isLoggedIn && <SoundSystem />}
    </div>
  );
};

// Main Router Component
const AppRouter = () => {
  const { user } = useApp();

  return (
    <Router basename="/Focus-Tracker">
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={user.isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/signup"
            element={
              user.isLoggedIn ? <Navigate to="/dashboard" /> : <Signup />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <FocusRooms />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              user.isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={
              user.isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </AppLayout>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

export default App;
