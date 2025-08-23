import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import './Auth.css';

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT',
    name: '',
    phoneNumber: '',
    department: '',
    yearOfStudy: 1,
    cgpa: 0.0,
    adminSecret: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const departments = [
    'Admin',
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Chemical',
    'Biotechnology',
    'Mathematics',
    'Physics',
    'Chemistry'
  ];

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    let submitData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      department: formData.department,
    };

    if (formData.role === 'ADMIN') {
      if (!formData.adminSecret) {
        setError('Admin secret is required for admin registration.');
        setLoading(false);
        return;
      }
      submitData.adminSecret = formData.adminSecret;
    } else if (formData.role === 'STUDENT') {
      submitData.yearOfStudy = formData.yearOfStudy;
      submitData.cgpa = formData.cgpa;
    }

    const response = await apiService.signup(submitData);

    if (response.success) {
      login(response);
      navigate('/dashboard', { replace: true });
    } else {
      setError(response.message || 'Signup failed');
    }
  } catch (err) {
  const msg =
    err?.response?.data?.message || // backend error (like wrong admin secret)
    err?.message || 
    'Invalid AdminSecretKey. Enter Correct Key...';
  setError(msg);
} finally {
  setLoading(false);
}

};


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <div className="auth-icon signup-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <h2>Create Account</h2>
          <p>Join our academic portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="form-group">
            <label>Account Type</label>
            <div className="role-selection">
              <button
                type="button"
                onClick={() => handleRoleChange('STUDENT')}
                className={`role-button ${formData.role === 'STUDENT' ? 'active' : ''}`}
              >
                <i className="fas fa-graduation-cap"></i>
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`role-button ${formData.role === 'ADMIN' ? 'active' : ''}`}
              >
                <i className="fas fa-users-cog"></i>
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div className="form-row">
            {/* Username */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-container">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-container">
                <i className="fas fa-phone input-icon"></i>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  placeholder="1234567890"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            {/* Department */}
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
           
            </div>
          
{formData.role === "ADMIN" && (
  <div className="form-group">
    <label htmlFor="adminSecret">Admin Secret</label>
    <input
      type="password"
      id="adminSecret"
      name="adminSecret"
      value={formData.adminSecret || ""}
      onChange={handleChange}
      placeholder="Enter Admin Secret Key"
      required
    />
  </div>
)}



            {/* Student-specific fields */}
            {formData.role === 'STUDENT' && (
              <>
                <div className="form-group">
                  <label htmlFor="yearOfStudy">Year of Study</label>
                  <select
                    id="yearOfStudy"
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    required
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {formData.role === 'STUDENT' && (
            <div className="form-group">
              <label htmlFor="cgpa">CGPA</label>
              <input
                type="number"
                id="cgpa"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <small className="form-hint">
              Password must be at least 6 characters long
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button signup-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            {onSwitchToLogin ? (
              <button
                onClick={onSwitchToLogin}
                className="link-button"
              >
                Sign in here
              </button>
            ) : (
              <Link to="/login" className="link-button">
                Sign in here
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;