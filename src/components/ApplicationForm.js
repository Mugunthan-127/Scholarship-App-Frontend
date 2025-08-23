import React, { useState } from 'react';
import { applicationAPI } from '../utils/api';

const ApplicationForm = ({ scholarship, students, onSuccess, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    documents: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Please select a student';
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
      const applicationData = {
        studentId: parseInt(formData.studentId),
        scholarshipId: scholarship.id,
        documents: formData.documents || ''
      };

      await applicationAPI.submitApplication(applicationData);
      onSuccess();
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response.data?.error?.includes('already exists')) {
          setMessage('This student has already applied for this scholarship.');
        } else {
          setMessage('Invalid application data. Please check your inputs.');
        }
      } else {
        setMessage('Failed to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Apply for {scholarship.name}</h2>
          <button className="btn btn-secondary" onClick={onCancel}>
            ← Cancel
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Scholarship Information</h3>
        <p><strong>Name:</strong> {scholarship.name}</p>
        <p><strong>Amount:</strong> ₹{scholarship.amount?.toLocaleString()}</p>
        <p><strong>Deadline:</strong> {scholarship.deadline}</p>
        <p><strong>Description:</strong> {scholarship.description}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentId" className="form-label">Select Student *</label>
          <select
            id="studentId"
            name="studentId"
            className={`form-control ${errors.studentId ? 'error' : ''}`}
            value={formData.studentId}
            onChange={handleChange}
          >
            <option value="">Choose a student...</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.email}) - {student.department} - Year {student.yearOfStudy} - CGPA: {student.cgpa}
              </option>
            ))}
          </select>
          {errors.studentId && <div className="error-message">{errors.studentId}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="documents" className="form-label">Supporting Documents (URL)</label>
          <input
            type="url"
            id="documents"
            name="documents"
            className="form-control"
            value={formData.documents}
            onChange={handleChange}
            placeholder="Enter document URL (optional)"
          />
          <small style={{ color: '#666', fontSize: '0.875rem' }}>
            Provide a URL to your supporting documents (transcripts, certificates, etc.)
          </small>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;