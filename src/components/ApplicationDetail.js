import React, { useState } from 'react';

const ApplicationDetail = ({ application, onBack, onStatusUpdate }) => {
  const [status, setStatus] = useState(application.status);
  const [comments, setComments] = useState(application.comments || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (status === application.status && comments === (application.comments || '')) {
      alert('No changes to update.');
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusUpdate(application.id, status, comments);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsUpdating(false);
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

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="card-title">Application Review</h2>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back to Applications
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Student Information */}
        <div>
          <h3>Student Information</h3>
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
            <p><strong>Name:</strong> {application.student?.name}</p>
            <p><strong>Email:</strong> {application.student?.email}</p>
            <p><strong>Phone:</strong> {application.student?.phoneNumber}</p>
            <p><strong>Department:</strong> {application.student?.department}</p>
            <p><strong>Year of Study:</strong> {application.student?.yearOfStudy}</p>
            <p><strong>CGPA:</strong> {application.student?.cgpa}</p>
          </div>
        </div>

        {/* Scholarship Information */}
        <div>
          <h3>Scholarship Information</h3>
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
            <p><strong>Name:</strong> {application.scholarship?.name}</p>
            <p><strong>Amount:</strong> ₹{application.scholarship?.amount?.toLocaleString()}</p>
            <p><strong>Deadline:</strong> {application.scholarship?.deadline}</p>
            <p><strong>Description:</strong> {application.scholarship?.description}</p>
            <p><strong>Criteria:</strong> {application.scholarship?.criteria}</p>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Application Details</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
          <p><strong>Application ID:</strong> {application.id}</p>
          <p><strong>Application Date:</strong> {application.applicationDate}</p>
          <p><strong>Current Status:</strong> 
            <span className={`badge ${getStatusBadgeClass(application.status)}`} style={{ marginLeft: '0.5rem' }}>
              {application.status.replace('_', ' ')}
            </span>
          </p>
          {application.documents && (
            <p><strong>Documents:</strong> 
              <a href={application.documents} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '0.5rem' }}>
                View Documents
              </a>
            </p>
          )}
          {application.comments && (
            <p><strong>Previous Comments:</strong> {application.comments}</p>
          )}
        </div>
      </div>

      {/* Status Update Form */}
      <div style={{ backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <h3>Update Application Status</h3>
        
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comments" className="form-label">Comments</label>
          <textarea
            id="comments"
            className="form-control"
            rows="4"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add your review comments here..."
          />
        </div>

        <button 
          className="btn btn-success"
          onClick={handleStatusUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetail;