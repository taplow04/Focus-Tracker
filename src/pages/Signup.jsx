import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
      // Validation
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill in all fields");
        return;
      }

      if (formData.name.length < 3) {
        setError("Name must be at least 3 characters");
        return;
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Create account
      signup(formData.name, formData.email);

      // Simulate delay
      setTimeout(() => {
        navigate("/dashboard");
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Signup failed. Please try again.");
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
            <h2>Get StartedToday</h2>
            <p className="auth-subtitle">Join thousands of focused students</p>

            {error && <div className="error-message fade-in">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

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
                placeholder="Create a strong password"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            <div className="terms-check">
              <input
                type="checkbox"
                id="terms"
                defaultChecked
                disabled={loading}
              />
              <label htmlFor="terms">I agree to the Terms & Conditions</label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <button type="button" className="btn btn-outline btn-lg btn-block">
              Sign up with Google
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <a href="/login" className="auth-link">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Success Benefits */}
        <div className="features-preview">
          <h3>Start Your Focus Journey</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <p>Unlimited focus sessions & tracking</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <p>Advanced analytics & goal setting</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <p>Join live focus rooms with others</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <p>Ambient sounds for better focus</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <p>Earn focus score & badges</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <p>100% free, no credit card needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
