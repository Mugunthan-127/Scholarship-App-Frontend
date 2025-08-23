import React, { useState } from 'react';
import api from '../utils/api';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/reset-password?token=${token}&newPassword=${newPassword}`);
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || 'Error resetting password');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <div className="form-group">
          <label>New Password:</label>
          <input 
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success mt-2">Reset Password</button>
      </form>
      {message && <div className="alert alert-info mt-2">{message}</div>}
    </div>
  );
};

export default ResetPassword;
