import React, { useState, useEffect } from 'react';
import { scholarshipAPI } from '../utils/api';
import ScholarshipDetail from './ScholarshipDetail';

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newScholarship, setNewScholarship] = useState({
    name: '',
    description: '',
    amount: '',
    deadline: '',
    criteria: '',
    isActive: true
  });

  useEffect(() => {
    fetchScholarships();
  }, [filter, searchKeyword]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      let response;

      // Use new search API if a keyword is provided
      if (searchKeyword.trim()) {
        const activeParam = filter === 'active' ? 'true' : filter === 'inactive' ? 'false' : '';
        response = await scholarshipAPI.searchScholarships(searchKeyword, activeParam);
      } else {
        if (filter === 'active') {
          response = await scholarshipAPI.getActiveScholarships();
        } else {
          response = await scholarshipAPI.getAllScholarships();
          if (filter === 'inactive') {
            response.data = Array.isArray(response.data) ? response.data.filter(s => !s.isActive) : [];
          }
        }
      }

      if (Array.isArray(response.data)) {
        setScholarships(response.data);
        setError('');
      } else {
        setScholarships([]);
        setError('Unexpected data format received from server.');
      }
    } catch (err) {
      setError('Failed to fetch scholarships. Please try again.');
      console.error('Error fetching scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScholarship = async (e) => {
    e.preventDefault();
    try {
      const scholarshipData = {
        ...newScholarship,
        amount: parseInt(newScholarship.amount, 10)
      };

      await scholarshipAPI.createScholarship(scholarshipData);
      setNewScholarship({
        name: '',
        description: '',
        amount: '',
        deadline: '',
        criteria: '',
        isActive: true
      });
      setShowCreateForm(false);
      fetchScholarships();
    } catch (err) {
      setError('Failed to create scholarship. Please try again.');
      console.error('Error creating scholarship:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      try {
        await scholarshipAPI.deleteScholarship(id);
        fetchScholarships();
      } catch (err) {
        setError('Failed to delete scholarship. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await scholarshipAPI.toggleScholarshipStatus(id);
      fetchScholarships();
    } catch (err) {
      setError('Failed to update scholarship status. Please try again.');
    }
  };

  if (selectedScholarship) {
    return (
      <ScholarshipDetail 
        scholarship={selectedScholarship}
        onBack={() => setSelectedScholarship(null)}
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
    <div>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">Scholarships</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : 'Create New Scholarship'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Filter & Search Controls */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search scholarships..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />

          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateScholarship} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h3>Create New Scholarship</h3>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-control"
                value={newScholarship.name}
                onChange={(e) => setNewScholarship({...newScholarship, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control"
                rows="3"
                value={newScholarship.description}
                onChange={(e) => setNewScholarship({...newScholarship, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input
                type="number"
                className="form-control"
                value={newScholarship.amount}
                onChange={(e) => setNewScholarship({...newScholarship, amount: e.target.value})}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline *</label>
              <input
                type="date"
                className="form-control"
                value={newScholarship.deadline}
                onChange={(e) => setNewScholarship({...newScholarship, deadline: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Criteria *</label>
              <textarea
                className="form-control"
                rows="3"
                value={newScholarship.criteria}
                onChange={(e) => setNewScholarship({...newScholarship, criteria: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={newScholarship.isActive}
                  onChange={(e) => setNewScholarship({...newScholarship, isActive: e.target.checked})}
                />
                <span style={{ marginLeft: '0.5rem' }}>Active</span>
              </label>
            </div>
            <button type="submit" className="btn btn-success">Create Scholarship</button>
          </form>
        )}

        {(!Array.isArray(scholarships) || scholarships.length === 0) ? (
          <div className="alert alert-info">
            No scholarships found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.map(scholarship => (
                  <tr key={scholarship.id}>
                    <td>{scholarship.id}</td>
                    <td>{scholarship.name}</td>
                    <td>₹{scholarship.amount?.toLocaleString()}</td>
                    <td>{scholarship.deadline}</td>
                    <td>
                      <span className={`badge ${scholarship.isActive ? 'badge-active' : 'badge-inactive'}`}>
                        {scholarship.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setSelectedScholarship(scholarship)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        View Details
                      </button>
                      <button 
                        className={`btn ${scholarship.isActive ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(scholarship.id)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        {scholarship.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(scholarship.id)}
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
    </div>
  );
};

export default ScholarshipList;
