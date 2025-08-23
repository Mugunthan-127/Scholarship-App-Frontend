import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import './Navbar.css';
import Notifications from './Notifications';
import AnalyticsDashboard from './FloatingAnalytics';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      logout();
      navigate('/');
      closeMenu();
    } catch (error) {
      console.error('Logout error:', error);
      logout(); // Force logout even if API call fails
      navigate('/');
      closeMenu();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar-container')) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link 
          to="/" 
          className="navbar-brand"
          onClick={closeMenu}
        >
          <span className="logo-icon">🎓</span>
          <span className="brand-text">Scholarship Portal</span>
        </Link>
        
   <Notifications studentId={1} />
   <AnalyticsDashboard/>


        
        <div className="navbar-right">
          <button 
            className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
          </button>

          <ul className={`navbar-nav ${isMenuOpen ? 'show' : ''}`}>
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </Link>
            </li>
            
            {user && (
              <li>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <span className="nav-icon">📊</span>
                  <span className="nav-text">Dashboard</span>
                </Link>
              </li>
            )}

            {user && user.role !== 'ADMIN' && (
            <li>
              <Link 
                to="/students/register" 
                className={`nav-link ${isActive('/students/register') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Student Registration</span>
              </Link>
            </li>
            )}

            {user && user.role === 'ADMIN' && (
            <li>
              <Link 
                to="/students" 
                className={`nav-link ${isActive('/students') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">👩‍🎓</span>
                <span className="nav-text">Students</span>
              </Link>
            </li>
            )}

            <li>
              <Link 
                to="/scholarships" 
                className={`nav-link ${isActive('/scholarships') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">🏆</span>
                <span className="nav-text">Scholarships</span>
              </Link>
            </li>

            {user && (
            <li>
              <Link 
                to="/applications" 
                className={`nav-link ${isActive('/applications') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-text">Applications</span>
              </Link>
            </li>
            )}
          </ul>

          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">
                  Welcome, {user.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="nav-button logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
            <Link 
              to="/login" 
              className="nav-button login-btn"
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="nav-button register-btn"
              onClick={closeMenu}
            >
              Register
            </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>

  
  
          )
};

export default Navbar;