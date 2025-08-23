import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown',
      responseData: error.response?.data,
      requestData: error.config?.data
    });

    // Handle specific error cases
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - Backend server might be down');
      return Promise.reject({
        message: 'Unable to connect to server. Please check if the backend is running.',
        code: 'CONNECTION_ERROR'
      });
    }

    if (error.code === 'NETWORK_ERROR') {
      console.error('Network error - Check internet connection');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      });
    }

    if (error.response?.status === 401) {
      console.error('Unauthorized - Token might be expired');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

const apiService = {
  // Auth endpoints
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup API error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Logout API error:', error);
      // Clear tokens even if API call fails
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      throw error;
    }
  },

  // Scholarship endpoints
  async getScholarships() {
    try {
      console.log('Fetching scholarships...');
      const response = await api.get('/scholarships');
      console.log('Scholarships fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get scholarships error:', error);
      
      // Provide more specific error messages
      if (error.code === 'CONNECTION_ERROR') {
        throw new Error('Unable to connect to server. Please ensure the backend is running on the correct port.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Scholarships endpoint not found. Please check the API route.');
      }
      
      if (error.response?.status === 500) {
        throw new Error('Server error while fetching scholarships. Please try again later.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch scholarships');
    }
  },

  async createScholarship(scholarshipData) {
    try {
      const response = await api.post('/scholarships', scholarshipData);
      return response.data;
    } catch (error) {
      console.error('Create scholarship error:', error);
      throw error;
    }
  },

  async updateScholarship(id, scholarshipData) {
    try {
      const response = await api.put(`/scholarships/${id}`, scholarshipData);
      return response.data;
    } catch (error) {
      console.error('Update scholarship error:', error);
      throw error;
    }
  },

  async deleteScholarship(id) {
    try {
      const response = await api.delete(`/scholarships/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete scholarship error:', error);
      throw error;
    }
  },

  // Student endpoints
  async getStudents() {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  },

  async createStudent(studentData) {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  },

  async updateStudent(id, studentData) {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  },

  async deleteStudent(id) {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete student error:', error);
      throw error;
    }
  },

  // Application endpoints
  async getApplications() {
    try {
      const response = await api.get('/applications');
      return response.data;
    } catch (error) {
      console.error('Get applications error:', error);
      throw error;
    }
  },

  async createApplication(applicationData) {
    try {
      const response = await api.post('/applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Create application error:', error);
      throw error;
    }
  },

  async updateApplication(id, applicationData) {
    try {
      const response = await api.put(`/applications/${id}`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Update application error:', error);
      throw error;
    }
  },

  async deleteApplication(id) {
    try {
      const response = await api.delete(`/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete application error:', error);
      throw error;
    }
  },

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};

export default apiService;