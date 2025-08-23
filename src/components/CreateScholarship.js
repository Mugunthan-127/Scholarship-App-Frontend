import React, { useState } from 'react';
import { scholarshipAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CreateScholarship = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    deadline: '',
    criteria: '',
    isActive: true
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be positive';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (!formData.criteria.trim()) newErrors.criteria = 'Criteria is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await scholarshipAPI.createScholarship({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setMessage('Scholarship created successfully!');
      navigate('/scholarships'); // Redirect to scholarship list
    } catch (err) {
      console.error(err);
      setMessage('Failed to create scholarship. Please try again.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Create Scholarship</h2>
      </div>

      {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label>Amount *</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="form-control" />
          {errors.amount && <div className="error-message">{errors.amount}</div>}
        </div>

        <div className="form-group">
          <label>Deadline *</label>
          <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="form-control" />
          {errors.deadline && <div className="error-message">{errors.deadline}</div>}
        </div>

        <div className="form-group">
          <label>Criteria *</label>
          <input type="text" name="criteria" value={formData.criteria} onChange={handleChange} className="form-control" />
          {errors.criteria && <div className="error-message">{errors.criteria}</div>}
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Create Scholarship</button>
      </form>
    </div>
  );
};

export default CreateScholarship;
