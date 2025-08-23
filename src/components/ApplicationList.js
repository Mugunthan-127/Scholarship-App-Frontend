import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../utils/api';
import ApplicationDetail from './ApplicationDetail';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'all') {
        response = await applicationAPI.getAllApplications();
      } else {
        response = await applicationAPI.getApplicationsByStatus(filter);
      }
      
      // Add safety checks to ensure we have an array
      // Try different possible data locations based on your API structure
      const responseData = response?.data?.applications || response?.data || response?.applications || response;
      const applicationsData = Array.isArray(responseData) ? responseData : [];
      
      console.log('API Response:', response); // Debug log
      console.log('Applications Data:', applicationsData); // Debug log
      
      setApplications(applicationsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch applications. Please try again.');
      setApplications([]); // Reset to empty array on error
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, comments) => {
    try {
      await applicationAPI.updateApplicationStatus(id, { status, comments });
      fetchApplications();
      setSelectedApplication(null);
    } catch (err) {
      setError('Failed to update application status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationAPI.deleteApplication(id);
        fetchApplications();
      } catch (err) {
        setError('Failed to delete application. Please try again.');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'badge-pending';
      case 'APPROVED':
        return 'badge-approved';
      case 'REJECTED':
        return 'badge-rejected';
      case 'UNDER_REVIEW':
        return 'badge-pending';
      default:
        return 'badge-pending';
    }
  };

  if (selectedApplication) {
    return (
      <ApplicationDetail
        application={selectedApplication}
        onBack={() => setSelectedApplication(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Applications</h2>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* Filter Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All Applications
        </button>
        <button 
          className={`btn ${filter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('PENDING')}
        >
          Pending
        </button>
        <button 
          className={`btn ${filter === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('APPROVED')}
        >
          Approved
        </button>
        <button 
          className={`btn ${filter === 'REJECTED' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('REJECTED')}
        >
          Rejected
        </button>
        <button 
          className={`btn ${filter === 'UNDER_REVIEW' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('UNDER_REVIEW')}
        >
          Under Review
        </button>
      </div>

      {/* Additional safety check before rendering */}
      {!Array.isArray(applications) ? (
        <div className="alert alert-warning">
          Error: Invalid data format received from server.
        </div>
      ) : applications.length === 0 ? (
        <div className="alert alert-info">
          No applications found for the selected filter.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Scholarship</th>
                <th>Application Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id}>
                  <td>{application.id}</td>
                  <td>
                    {application.student?.name}
                    <br />
                    <small style={{ color: '#666' }}>{application.student?.email}</small>
                  </td>
                  <td>
                    {application.scholarship?.name}
                    <br />
                    <small style={{ color: '#666' }}>₹{application.scholarship?.amount?.toLocaleString()}</small>
                  </td>
                  <td>{application.applicationDate}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSelectedApplication(application)}
                      style={{ marginRight: '0.5rem' }}
                    >
                      Review
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(application.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;