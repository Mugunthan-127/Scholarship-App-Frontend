//api.js
import axios from 'axios';

const API_BASE_URL = 'https://scholarship-app-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Student API calls
export const studentAPI = {
  createStudent: (student) => api.post('/students', student),
  getAllStudents: () => api.get('/students'),
  getStudentById: (id) => api.get(`/students/${id}`),
  getStudentByEmail: (email) => api.get(`/students/email/${email}`),
  updateStudent: (id, student) => api.put(`/students/${id}`, student),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

// Scholarship API calls
export const scholarshipAPI = {
  createScholarship: (scholarship) => api.post('/scholarships', scholarship),
  getAllScholarships: () => api.get('/scholarships'),
  getActiveScholarships: () => api.get('/scholarships?active=true'),
  getScholarshipById: (id) => api.get(`/scholarships/${id}`),
  updateScholarship: (id, scholarship) => api.put(`/scholarships/${id}`, scholarship),
  toggleScholarshipStatus: (id) => api.put(`/scholarships/${id}/toggle-status`),
  deleteScholarship: (id) => api.delete(`/scholarships/${id}`),
  searchScholarships: (keyword = '', active = '') => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (active !== '') params.append('active', active);
    return api.get(`/scholarships/search?${params.toString()}`);
  }
};

// FAQ API calls
export const faqAPI = {
  // Search FAQs by question keyword
  searchFaq: (question) => api.get(`/faqs/search?question=${encodeURIComponent(question)}`),

  // Admin CRUD operations
  getAllFaqs: () => api.get('/faqs'),
  getFaqById: (id) => api.get(`/faqs/${id}`),
  createFaq: (faq) => api.post('/faqs', faq),
  updateFaq: (id, faq) => api.put(`/faqs/${id}`, faq),
  deleteFaq: (id) => api.delete(`/faqs/${id}`),
};

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  signup: (userData) => api.post('/auth/signup', userData).then(res => res.data),
  forgotPassword: (email) =>
    api.post('/auth/forgot-password', null, { params: { email } }).then(res => res.data),
  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', null, { params: { token, newPassword } }).then(res => res.data),
};




// Application API calls
export const applicationAPI = {
  submitApplication: (application) => api.post('/applications', application),
  getAllApplications: () => api.get('/applications'),
  getApplicationsByStatus: (status) => api.get(`/applications?status=${status}`),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  getApplicationsByStudentId: (studentId) => api.get(`/applications/student/${studentId}`),
  updateApplicationStatus: (id, statusData) => api.put(`/applications/${id}/status`, statusData),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};






export default api;
