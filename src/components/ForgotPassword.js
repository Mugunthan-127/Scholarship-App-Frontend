import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // For reset-password page
  const navigate = useNavigate();

  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await apiService.forgotPassword({ email });
      setMessage(response?.message || 'Password reset link sent.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await apiService.resetPassword({ token, newPassword });
      setMessage(response?.message || 'Password reset successful.');
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3s
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // If token exists, show reset password form
  if (token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Reset Password</h2>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <Link to="/login" className="link-button">Back to Login</Link>
        </div>
      </div>
    );
  }

  // Otherwise, show forgot password form
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <form onSubmit={handleSendLink} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <Link to="/login" className="link-button">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
