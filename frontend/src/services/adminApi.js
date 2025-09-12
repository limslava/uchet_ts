import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

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
  resetPassword: (id, passwordData) => 
  api.post(`/api/admin/users/${id}/reset-password`, passwordData),

  // Управление справочниками
  getCarBrands: (params) => api.get('/api/admin/dictionaries/car-brands', { params }),
  createCarBrand: (data) => api.post('/api/admin/dictionaries/car-brands', data),
  updateCarBrand: (id, data) => api.put(`/api/admin/dictionaries/car-brands/${id}`, data),
  deleteCarBrand: (id) => api.delete(`/api/admin/dictionaries/car-brands/${id}`),

  getCarModels: (params) => api.get('/api/admin/dictionaries/car-models', { params }),
  createCarModel: (data) => api.post('/api/admin/dictionaries/car-models', data),
  updateCarModel: (id, data) => api.put(`/api/admin/dictionaries/car-models/${id}`, data),
  deleteCarModel: (id) => api.delete(`/api/admin/dictionaries/car-models/${id}`),

  getDirections: (params) => api.get('/api/admin/dictionaries/directions', { params }),
  createDirection: (data) => api.post('/api/admin/dictionaries/directions', data),
  updateDirection: (id, data) => api.put(`/api/admin/dictionaries/directions/${id}`, data),
  deleteDirection: (id) => api.delete(`/api/admin/dictionaries/directions/${id}`),

  getTransportMethods: (params) => api.get('/api/admin/dictionaries/transport-methods', { params }),
  createTransportMethod: (data) => api.post('/api/admin/dictionaries/transport-methods', data),
  updateTransportMethod: (id, data) => api.put(`/api/admin/dictionaries/transport-methods/${id}`, data),
  deleteTransportMethod: (id) => api.delete(`/api/admin/dictionaries/transport-methods/${id}`),

  getLocations: (params) => api.get('/api/admin/dictionaries/locations', { params }),
  createLocation: (data) => api.post('/api/admin/dictionaries/locations', data),
  updateLocation: (id, data) => api.put(`/api/admin/dictionaries/locations/${id}`, data),
  deleteLocation: (id) => api.delete(`/api/admin/dictionaries/locations/${id}`),

  // Дополнительные справочники
getDrivers: (params) => api.get('/api/admin/dictionaries/drivers', { params }),
createDriver: (data) => api.post('/api/admin/dictionaries/drivers', data),
updateDriver: (id, data) => api.put(`/api/admin/dictionaries/drivers/${id}`, data),
deleteDriver: (id) => api.delete(`/api/admin/dictionaries/drivers/${id}`),

getCompanyVehicles: (params) => api.get('/api/admin/dictionaries/company-vehicles', { params }),
createCompanyVehicle: (data) => api.post('/api/admin/dictionaries/company-vehicles', data),
updateCompanyVehicle: (id, data) => api.put(`/api/admin/dictionaries/company-vehicles/${id}`, data),
deleteCompanyVehicle: (id) => api.delete(`/api/admin/dictionaries/company-vehicles/${id}`),

getContainers: (params) => api.get('/api/admin/dictionaries/containers', { params }),
createContainer: (data) => api.post('/api/admin/dictionaries/containers', data),
updateContainer: (id, data) => api.put(`/api/admin/dictionaries/containers/${id}`, data),
deleteContainer: (id) => api.delete(`/api/admin/dictionaries/containers/${id}`),

  // Методы для печати
  printVehicleAct: (id) => api.get(`/api/admin/vehicle-acts/${id}/print`),
  printContract: (id) => api.get(`/api/admin/vehicle-acts/${id}/print-contract`),

  // Аналитика
  getDashboardStats: () => api.get('/api/admin/analytics/stats'),
  getSettings: () => api.get('/api/admin/settings'),

  // Управление актами приёмки
  getVehicleActs: (params) => api.get('/api/admin/vehicle-acts', { params }),
  getVehicleAct: (id) => api.get(`/api/admin/vehicle-acts/${id}`),
  updateVehicleAct: (id, data) => api.put(`/api/admin/vehicle-acts/${id}`, data),
  deleteVehicleAct: (id) => api.delete(`/api/admin/vehicle-acts/${id}`),
};

export default adminApi;