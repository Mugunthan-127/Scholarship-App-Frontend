import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout, updateUser } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    bio: '',
    profilePicture: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize profile data when user changes or component mounts
  useEffect(() => {
    if (user) {
      // Load saved profile data from localStorage
      const savedProfile = localStorage.getItem(`profile_${user.id || user.username}`);
      const defaultProfile = {
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || '',
          github: user.socialLinks?.github || ''
        }
      };

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData({ ...defaultProfile, ...parsedProfile });
      } else {
        setProfileData(defaultProfile);
      }
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    // Clear any cached profile data on logout
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('profile_')) {
        localStorage.removeItem(key);
      }
    });
    alert("You have been logged out successfully!");
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
    setError('');
    setSuccess('');
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setError('');
    setSuccess('');
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setError('');
    setSuccess('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 for frontend storage
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfile = () => {
    if (!profileData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!profileData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (profileData.email && !/\S+@\S+\.\S+/.test(profileData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (profileData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(profileData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      setError('Current password is required');
      return false;
    }
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    // In a real app, you'd verify the current password
    // For demo purposes, we'll assume any non-empty current password is valid
    return true;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateProfile()) {
      setLoading(false);
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context with new data
      const updatedUser = { ...user, ...profileData };
      updateUser(updatedUser);
      
      // Save to localStorage
      localStorage.setItem(`profile_${user.id || user.username}`, JSON.stringify(profileData));
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        closeProfileModal();
      }, 2000);
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validatePassword()) {
      setLoading(false);
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd update the password on the backend
      // For demo purposes, we'll just show success
      setSuccess('Password changed successfully!');
      setTimeout(() => {
        closePasswordModal();
      }, 2000);
    } catch (error) {
      console.error('Password change error:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`;
    }
    return profileData.username || user?.username;
  };

  const getProfilePicture = () => {
    return profileData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=667eea&color=fff&size=80`;
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Academic Portal</h1>
          <p className="welcome-text">
            👋 Welcome, <strong>{getDisplayName()}</strong> ({user?.role})
          </p>
        </div>
        <div className="header-right">
          <button className="profile-btn" onClick={openProfileModal}>
            <i className="fas fa-user-edit"></i>
            Manage Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-card">
              <div className="profile-picture">
                <img src={getProfilePicture()} alt="Profile" />
              </div>
              <div className="welcome-content">
                <h2>Welcome back, {user?.role?.toLowerCase()}!</h2>
                <h3>{getDisplayName()}</h3>
                <p className="user-email">{profileData.email}</p>
                {profileData.phone && (
                  <p className="user-phone">📞 {profileData.phone}</p>
                )}
                {profileData.bio && (
                  <p className="user-bio">"{profileData.bio}"</p>
                )}
              </div>
              <button className="edit-profile-quick" onClick={openProfileModal}>
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>

          {/* Role-specific Content */}
          <div className="content-section">
            <div className="section-header">
              <h3>
                {user?.role === "ADMIN"
                  ? "Admin Dashboard"
                  : "Student Dashboard"}
              </h3>
            </div>

            {user?.role === "ADMIN" ? (
              <AdminDashboard onProfileEdit={openProfileModal} />
            ) : (
              <StudentDashboard onProfileEdit={openProfileModal} />
            )}
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={closeProfileModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-user-edit"></i>
                Manage Profile
              </h2>
              <button className="close-btn" onClick={closeProfileModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="profile-form" onSubmit={handleProfileSubmit}>
              {/* Profile Picture Section */}
              <div className="profile-picture-section">
                <div className="current-picture">
                  <img src={getProfilePicture()} alt="Current Profile" />
                </div>
                <div className="picture-upload">
                  <label htmlFor="profilePicture" className="upload-btn">
                    <i className="fas fa-camera"></i>
                    Change Picture
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="username">Username *</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Your full address..."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Tell us about yourself..."
                  maxLength="500"
                />
                <small className="char-count">
                  {profileData.bio.length}/500 characters
                </small>
              </div>

              {/* Social Links Section */}
              <div className="social-links-section">
                <h4><i className="fas fa-share-alt"></i> Social Links</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      type="url"
                      id="linkedin"
                      name="social.linkedin"
                      value={profileData.socialLinks.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="twitter">Twitter</label>
                    <input
                      type="url"
                      id="twitter"
                      name="social.twitter"
                      value={profileData.socialLinks.twitter}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="github">GitHub</label>
                    <input
                      type="url"
                      id="github"
                      name="social.github"
                      value={profileData.socialLinks.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="secondary-btn"
                  onClick={openPasswordModal}
                >
                  <i className="fas fa-key"></i>
                  Change Password
                </button>
                <div className="action-group">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeProfileModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={closePasswordModal}>
          <div className="modal-content password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-key"></i>
                Change Password
              </h2>
              <button className="close-btn" onClick={closePasswordModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="profile-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group full-width">
                <label htmlFor="currentPassword">Current Password *</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="newPassword">New Password *</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
                <small className="help-text">Must be at least 6 characters long</small>
              </div>

              <div className="form-group full-width">
                <label htmlFor="confirmPassword">Confirm New Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <div></div> {/* Empty div for spacing */}
                <div className="action-group">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closePasswordModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Changing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-key"></i>
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ onProfileEdit }) => {
  return (
    <div className="dashboard-content">
      <p className="description">
        Welcome to the admin dashboard! Here you can manage students, view
        applications, and perform administrative tasks.
      </p>

      <div className="feature-grid">
        <div className="feature-card blue" onClick={onProfileEdit}>
          <i className="fas fa-user-cog"></i>
          <h4>My Profile</h4>
          <p>View and edit your admin profile</p>
        </div>

        <div className="feature-card green">
          <i className="fas fa-users"></i>
          <h4>Manage Students</h4>
          <p>View and edit student profiles</p>
        </div>

        <div className="feature-card orange">
          <i className="fas fa-file-alt"></i>
          <h4>Applications</h4>
          <p>Review student applications</p>
        </div>

        <div className="feature-card yellow">
          <i className="fas fa-chart-bar"></i>
          <h4>Reports</h4>
          <p>Generate academic reports</p>
        </div>

        <div className="feature-card purple">
          <i className="fas fa-cogs"></i>
          <h4>Settings</h4>
          <p>System configuration</p>
        </div>
      </div>
      
    </div>
  );
};

const StudentDashboard = ({ onProfileEdit }) => {
  return (
    <div className="dashboard-content">
      <p className="description">
        Welcome to your student portal! Here you can view your profile, submit
        applications, and track your academic progress.
      </p>

      <div className="feature-grid">
        <div className="feature-card blue" onClick={onProfileEdit}>
          <i className="fas fa-user"></i>
          <h4>My Profile</h4>
          <p>View and update your information</p>
        </div>

        <div className="feature-card green">
          <i className="fas fa-file-alt"></i>
          <h4>Applications</h4>
          <p>Submit and track applications</p>
        </div>

        <div className="feature-card purple">
          <i className="fas fa-book"></i>
          <h4>Academic Records</h4>
          <p>View your academic history</p>
        </div>

        <div className="feature-card orange">
          <i className="fas fa-calendar-alt"></i>
          <h4>Schedule</h4>
          <p>View your class schedule</p>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;
