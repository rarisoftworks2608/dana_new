import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dana_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('dana_admin_token');
      localStorage.removeItem('dana_admin_user');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Registration
export const registerAttendee = (payload) => api.post('/registrations', payload);
export const checkDuplicate = (email, mobile) =>
  api.get('/registrations/check', { params: { email, mobile } });
export const verifyRegistration = (token) => api.get(`/registrations/verify/${token}`);

// Auth
export const adminLogin = (credentials) => api.post('/auth/login', credentials);
export const getCurrentAdmin = () => api.get('/auth/me');

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRegistrations = (params) => api.get('/dashboard/registrations', { params });
export const updateRegistration = (id, payload) => api.put(`/dashboard/registrations/${id}`, payload);
export const deleteRegistration = (id) => api.delete(`/dashboard/registrations/${id}`);

// Attendance
export const scanCheckIn = (qrToken) => api.post('/attendance/checkin', { qrToken });
export const getAttendanceLog = (params) => api.get('/attendance', { params });

// Export
export const exportUrl = (format, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return `${API_BASE_URL}/export/${format}${query ? `?${query}` : ''}`;
};

export default api;
