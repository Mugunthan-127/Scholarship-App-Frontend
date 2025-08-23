import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
   <div className="hero">
        <h1>Scholarship Management Portal</h1>
        <p>Empowering students through accessible scholarship opportunities</p>
        <Link to="/scholarships" className="btn btn-primary">
          Browse Scholarships
        </Link>
      </div>

      <div className="container">
        {/* Features Section */}
        <div className="features">
          <div className="feature-card">
            <h3>🎓 Student Registration</h3>
            <p>Quick and easy student registration process with comprehensive profile management</p>
            <Link to="/students/register" className="btn btn-primary">
              Register Now
            </Link>
          </div>

          <div className="feature-card">
            <h3>💰 Scholarship Catalog</h3>
            <p>Browse through various scholarship opportunities with detailed eligibility criteria</p>
            <Link to="/scholarships" className="btn btn-primary">
              View Scholarships
            </Link>
          </div>

          <div className="feature-card">
            <h3>📋 Application Management</h3>
            <p>Submit applications seamlessly and track their status in real-time</p>
            <Link to="/applications" className="btn btn-primary">
              View Applications
            </Link>
          </div>
        </div>

        {/* Statistics or Additional Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">How It Works</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>1️⃣</div>
              <h4>Register</h4>
              <p>Create your student profile with academic details</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>2️⃣</div>
              <h4>Browse</h4>
              <p>Explore available scholarships and their requirements</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>3️⃣</div>
              <h4>Apply</h4>
              <p>Submit your application with supporting documents</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>4️⃣</div>
              <h4>Track</h4>
              <p>Monitor your application status and receive updates</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/students/register" className="btn btn-success">
              Register as Student
            </Link>
            <Link to="/students" className="btn btn-primary">
              View All Students
            </Link>
            <Link to="/scholarships" className="btn btn-primary">
              Browse Scholarships
            </Link>
            <Link to="/applications" className="btn btn-warning">
              Review Applications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;