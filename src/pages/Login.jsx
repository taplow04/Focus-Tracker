import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email");
        return;
      }

      // Extract name from email for now (frontend only)
      const name = formData.email.split("@")[0];
      login(name, formData.email);

      // Simulate delay
      setTimeout(() => {
        navigate("/dashboard");
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🎯</div>
            <h1>FocusFlow</h1>
            <p>Master Your Study</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">
              Sign in to continue your focus journey
            </p>

            {error && <div className="error-message fade-in">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button type="button" className="btn btn-outline btn-lg btn-block">
              Sign in with Google
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="auth-link">
                Create one
              </a>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="features-preview">
          <h3>Why Choose FocusFlow?</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">⏱️</span>
              <div>
                <h4>Smart Timer</h4>
                <p>Advanced Pomodoro with tracking</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <h4>Analytics</h4>
                <p>Track your progress with charts</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <div>
                <h4>Focus Rooms</h4>
                <p>Study with others anonymously</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎵</span>
              <div>
                <h4>Ambient Sounds</h4>
                <p>Rain, white noise & library sounds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
