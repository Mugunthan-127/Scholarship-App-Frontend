import React, { useState, useEffect } from 'react';
import { studentAPI} from '../utils/api';
import ApplicationForm from './ApplicationForm';

const ScholarshipDetail = ({ scholarship, onBack }) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showApplicationForm) {
      fetchStudents();
    }
  }, [showApplicationForm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAllStudents();
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false);
    alert('Application submitted successfully!');
  };

  if (showApplicationForm) {
    return (
      <ApplicationForm
        scholarship={scholarship}
        students={students}
        onSuccess={handleApplicationSuccess}
        onCancel={() => setShowApplicationForm(false)}
        loading={loading}
      />
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">{scholarship.name}</h2>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back to Scholarships
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h3>Scholarship Details</h3>
            <p><strong>Amount:</strong> ₹{scholarship.amount?.toLocaleString()}</p>
            <p><strong>Deadline:</strong> {scholarship.deadline}</p>
            <p><strong>Status:</strong> 
              <span className={`badge ${scholarship.isActive ? 'badge-active' : 'badge-inactive'}`} style={{ marginLeft: '0.5rem' }}>
                {scholarship.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Description</h3>
        <p style={{ lineHeight: '1.6', color: '#666' }}>{scholarship.description}</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Eligibility Criteria</h3>
        <p style={{ lineHeight: '1.6', color: '#666' }}>{scholarship.criteria}</p>
      </div>

      {scholarship.isActive && (
        <div>
          <button 
            className="btn btn-success"
            onClick={() => setShowApplicationForm(true)}
          >
            Apply for this Scholarship
          </button>
        </div>
      )}

      {!scholarship.isActive && (
        <div className="alert alert-info">
          This scholarship is currently inactive and not accepting applications.
        </div>
      )}
    </div>
  );
};

export default ScholarshipDetail;