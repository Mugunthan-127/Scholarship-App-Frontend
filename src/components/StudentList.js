import React, { useState, useEffect } from 'react';
import { studentAPI } from '../utils/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAllStudents();
      console.log("API response data:", response.data);  // Debug log

      if (Array.isArray(response.data)) {
        setStudents(response.data);
        setError('');
      } else {
        setStudents([]);
        setError('Unexpected data format received from server.');
      }
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.deleteStudent(id);
        setStudents(students.filter(student => student.id !== id));
      } catch (err) {
        setError('Failed to delete student. Please try again.');
        console.error('Error deleting student:', err);
      }
    }
  };

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
        <h2 className="card-title">All Students</h2>
      </div>

      {!loading && error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && students.length === 0 && !error && (
        <div className="alert alert-info">
          No students found. Register some students first.
        </div>
      )}

      {Array.isArray(students) && students.length > 0 && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Year</th>
                <th>CGPA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{student.department}</td>
                  <td>{student.yearOfStudy}</td>
                  <td>{student.cgpa}</td>
                  <td>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(student.id)}
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

export default StudentList;
