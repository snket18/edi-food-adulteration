import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('spectracheck_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optionally handle 401 globally here, but doing it in AuthContext is often cleaner
// so we don't cause circular dependencies with React hooks.

export const api = {
  // Auth
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),

  health: () => apiClient.get('/health'),
  
  // Simulated spectrum analysis endpoint
  analyzeSpectrum: (_imageBlob: Blob, mockScenario?: string) => {
    // In a real implementation, we'd send FormData containing the file
    return apiClient.post('/tests/analyze', { mockScenario });
  },

  // Save finalized test result
  saveTest: (data: { predictedClass: string; confidence: number; notes?: string }) => {
    return apiClient.post('/tests', data);
  },
  
  // Fetch test history
  getTests: () => {
    return apiClient.get('/tests');
  },
  
  // Fetch single test details
  getTestById: (id: string) => {
    return apiClient.get(`/tests/${id}`);
  },
  
  // Fetch monitoring dashboard data
  getMonitoringDashboard: () => {
    return apiClient.get('/monitoring/dashboard');
  },
  
  // Fetch geographic map data
  getMapData: () => {
    return apiClient.get('/monitoring/map');
  },
  
  // Fetch master report data
  getReportData: () => {
    return apiClient.get('/reports/data');
  }
};

// Request interceptor for inserting JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized access (e.g., redirect to login, clear token)
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default apiClient;
