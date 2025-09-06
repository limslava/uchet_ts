// frontend/src/services/api.js
import axios from 'axios';

// Базовый URL API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:5000';

// Создаем экземпляр axios с настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Добавляем interceptor для автоматического добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Функции API

// Аутентификация
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Vehicle Acts
export const createVehicleAct = async (formData) => {
  try {
    const response = await api.post('/vehicle-acts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehicleActs = async () => {
  try {
    const response = await api.get('/vehicle-acts');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getVehicleActById = async (id) => {
  try {
    const response = await api.get(`/vehicle-acts/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const confirmVehicleReceipt = async (id, receiptData) => {
  try {
    const response = await api.post(`/vehicle-acts/${id}/receive`, receiptData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const checkVin = async (vin) => {
  try {
    const response = await api.get(`/vehicle-acts/check-vin/${vin}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const exportDocx = async (id) => {
  try {
    const response = await api.get(`/vehicle-acts/${id}/export-docx`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Справочники
export const getCarBrands = async () => {
  try {
    const response = await api.get('/api/car-brands');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCarModels = async (brandId) => {
  try {
    const response = await api.get(`/api/car-brands/${brandId}/models`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getDirections = async () => {
  try {
    const response = await api.get('/api/dictionaries/directions');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTransportMethods = async () => {
  try {
    const response = await api.get('/api/dictionaries/transport-methods');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;