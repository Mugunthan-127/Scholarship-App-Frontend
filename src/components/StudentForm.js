import React, { useState } from 'react';
import { studentAPI } from '../utils/api';

const StudentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    yearOfStudy: '',
    cgpa: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Business Administration',
    'Commerce',
    'Economics'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.yearOfStudy) {
      newErrors.yearOfStudy = 'Year of study is required';
    } else if (formData.yearOfStudy < 1 || formData.yearOfStudy > 4) {
      newErrors.yearOfStudy = 'Year of study must be between 1 and 4';
    }

    if (!formData.cgpa) {
      newErrors.cgpa = 'CGPA is required';
    } else if (formData.cgpa < 0 || formData.cgpa > 10) {
      newErrors.cgpa = 'CGPA must be between 0 and 10';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const studentData = {
        ...formData,
        yearOfStudy: parseInt(formData.yearOfStudy),
        cgpa: parseFloat(formData.cgpa)
      };

      const response = await studentAPI.createStudent(studentData);
      
      setMessage('Student registered successfully!');
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        department: '',
        yearOfStudy: '',
        cgpa: ''
      });
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage('Student with this email already exists.');
      } else if (error.response?.data) {
        // Handle validation errors from backend
        if (typeof error.response.data === 'object') {
          setErrors(error.response.data);
        } else {
          setMessage('Error registering student. Please try again.');
        }
      } else {
        setMessage('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Student Registration</h2>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className={`form-control ${errors.phoneNumber ? 'error' : ''}`}
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            maxLength="10"
          />
          {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="department" className="form-label">Department *</label>
          <select
            id="department"
            name="department"
            className={`form-control ${errors.department ? 'error' : ''}`}
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <div className="error-message">{errors.department}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="yearOfStudy" className="form-label">Year of Study *</label>
          <select
            id="yearOfStudy"
            name="yearOfStudy"
            className={`form-control ${errors.yearOfStudy ? 'error' : ''}`}
            value={formData.yearOfStudy}
            onChange={handleChange}
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          {errors.yearOfStudy && <div className="error-message">{errors.yearOfStudy}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="cgpa" className="form-label">CGPA *</label>
          <input
            type="number"
            id="cgpa"
            name="cgpa"
            className={`form-control ${errors.cgpa ? 'error' : ''}`}
            value={formData.cgpa}
            onChange={handleChange}
            placeholder="Enter CGPA (0-10)"
            min="0"
            max="10"
            step="0.01"
          />
          {errors.cgpa && <div className="error-message">{errors.cgpa}</div>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register Student'}
        </button>
      </form>
    </div>
  );
};

export default StudentForm;