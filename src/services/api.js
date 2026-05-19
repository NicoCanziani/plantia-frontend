import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  exchange: (code) => api.post('/api/auth/exchange', { code }),
  me: () => api.get('/api/auth/me'),
};

// Plants
export const plantsAPI = {
  list: (params) => api.get('/api/plants', { params }),
  get: (id) => api.get(`/api/plants/${id}`),
  create: (data) => api.post('/api/plants', data),
  update: (id, data) => api.put(`/api/plants/${id}`, data),
  remove: (id) => api.delete(`/api/plants/${id}`),
  uploadImage: (id, file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post(`/api/plants/${id}/image`, form);
  },
};

// AI
export const aiAPI = {
  identify: (fileOrUrl) => {
    const form = new FormData();
    if (fileOrUrl instanceof File) {
      form.append('image', fileOrUrl);
    } else {
      form.append('imageUrl', fileOrUrl);
    }
    return api.post('/api/ai/identify', form);
  },
  careSummary: (plantName, plantType) =>
    api.post('/api/ai/care-summary', { plantName, plantType }),
  wateringSuggestion: (plantName, plantType, season) =>
    api.post('/api/ai/watering-suggestion', { plantName, plantType, season }),
};

// Calendar
export const calendarAPI = {
  list: (params) => api.get('/api/calendar', { params }),
  create: (data) => api.post('/api/calendar', data),
  update: (id, data) => api.put(`/api/calendar/${id}`, data),
  remove: (id) => api.delete(`/api/calendar/${id}`),
  complete: (id) => api.patch(`/api/calendar/${id}/complete`),
};

// Notifications
export const notificationsAPI = {
  getSettings: () => api.get('/api/notifications/settings'),
  updateSettings: (data) => api.put('/api/notifications/settings', data),
  subscribe: (subscription) => api.post('/api/notifications/subscribe', subscription),
  unsubscribe: (endpoint) => api.delete('/api/notifications/subscribe', { data: { endpoint } }),
};

export default api;
