import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000, // ← ДОБАВЬТЕ ТАЙМАУТ 10 секунд
});
// Добавьте интерсептор для JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Управление пользователями
getUsers: (params) => api.get('/api/admin/users', { params }),
  createUser: (userData) => api.post('/api/admin/users', userData),
  updateUser: (id, userData) => api.put(`/api/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  resetPassword: (id, newPassword) => 
    api.post(`/api/admin/users/${id}/reset-password`, { newPassword }),

  // Управление справочниками - ОБНОВИТЕ ЭТИ МЕТОДЫ:
  getCarBrands: (params) => api.get('/api/admin/dictionaries/car-brands', { params }),
  createCarBrand: (data) => api.post('/api/admin/dictionaries/car-brands', data),
  updateCarBrand: (id, data) => api.put(`/api/admin/dictionaries/car-brands/${id}`, data),
  deleteCarBrand: (id) => api.delete(`/api/admin/dictionaries/car-brands/${id}`),

  getCarModels: (params) => api.get('/api/admin/dictionaries/car-models', { params }),
  createCarModel: (data) => api.post('/api/admin/dictionaries/car-models', data),
  updateCarModel: (id, data) => api.put(`/api/admin/dictionaries/car-models/${id}`, data),
  deleteCarModel: (id) => api.delete(`/api/admin/dictionaries/car-models/${id}`),

  // Остальные методы для других справочников...
  getDirections: (params) => api.get('/api/admin/dictionaries/directions', { params }),
  createDirection: (data) => api.post('/api/admin/dictionaries/directions', data),
  
  getTransportMethods: (params) => api.get('/api/admin/dictionaries/transport-methods', { params }),
  createTransportMethod: (data) => api.post('/api/admin/dictionaries/transport-methods', data),
  
  getLocations: (params) => api.get('/api/admin/dictionaries/locations', { params }),
  createLocation: (data) => api.post('/api/admin/dictionaries/locations', data),

   // Новые методы для печати
  printVehicleAct: (id) => api.get(`/api/admin/vehicle-acts/${id}/print`),
  printContract: (id) => api.get(`/api/admin/vehicle-acts/${id}/print-contract`),

  // Аналитика
  getDashboardStats: () => api.get('/api/admin/analytics/stats'),
  getSettings: () => api.get('/api/admin/settings'),

  // Добавить в экспорт adminApi:
getVehicleActs: (params) => api.get('/api/admin/vehicle-acts', { params }),
getVehicleAct: (id) => api.get(`/api/admin/vehicle-acts/${id}`),
updateVehicleAct: (id, data) => api.put(`/api/admin/vehicle-acts/${id}`, data),
deleteVehicleAct: (id) => api.delete(`/api/admin/vehicle-acts/${id}`),
};



export default adminApi;