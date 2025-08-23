import React, { useState } from 'react';
import { scholarshipAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ScholarshipForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [criteria, setCriteria] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { name, description, amount, deadline, criteria, isActive };
      await scholarshipAPI.createScholarship(data);
      navigate('/scholarships'); // Redirect to scholarships list
    } catch (err) {
      setError('Failed to create scholarship. Check the inputs.');
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create Scholarship</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            className="form-control"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input
            className="form-control"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Criteria</label>
          <input
            className="form-control"
            type="text"
            value={criteria}
            onChange={(e) => setCriteria(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            /> Active
          </label>
        </div>

        <button type="submit" className="btn btn-success">Create Scholarship</button>
      </form>
    </div>
  );
};

export default ScholarshipForm;
