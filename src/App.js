import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import ScholarshipList from './components/ScholarshipList';
import ApplicationList from './components/ApplicationList';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/ScholarshipChatbot';

import './App.css';
import { AuthProvider } from './context/AuthContext';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';


function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ flex: 1 }}>
          <div className="container">
            <Routes>
                {/* Public Routes */}
              <Route path="/" element={<Home />} />
               <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/students/register" element={
                  <ProtectedRoute>
                    <StudentForm />
                  </ProtectedRoute>
                } />
                
                <Route path="/students" element={
                  <ProtectedRoute>
                    <StudentList />
                  </ProtectedRoute>
                } />
                
                <Route path="/scholarships" element={
                  <ProtectedRoute>
                    <ScholarshipList />
                  </ProtectedRoute>
                } />
                
                <Route path="/applications" element={
                  <ProtectedRoute>
                    <ApplicationList />
                  </ProtectedRoute>
                } />

                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        
        {/* Footer */}
               {/* Footer */}
        <footer style={{ 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          textAlign: 'center', 
          padding: '2rem 0',
          marginTop: '3rem'
        }}>
          <div className="container">
            <p>&copy; 2025 Scholarship Management Portal. All rights reserved.</p>
            <p>Empowering students through accessible education funding.</p>
          </div>
        </footer>

        {/* Floating Chatbot (like logo on side) */}
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000
        }}>
          <Chatbot />
        </div>
      </div>

    </Router>
    </AuthProvider>
  );
}

export default App;