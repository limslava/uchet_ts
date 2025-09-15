const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://192.168.0.121:5000';

async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const getVehicleActById = async (id) => {
  return request(`/vehicle-acts/${id}`);
};

export const confirmVehicleReceipt = async (actId) => {
  return request(`/vehicle-acts/${actId}/receive`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Ошибка входа');
  }

  return response.json();
};

export const selectLocation = async (userId, locationId) => {
  return request(`/api/auth/${userId}/location`, {
    method: 'POST',
    body: JSON.stringify({ locationId }),
  });
};

export const getCarBrands = async () => {
  return request('/api/car-brands');
};

export const getDirections = async () => {
  return request('/api/dictionaries/directions');
};

export const getTransportMethods = async () => {
  return request('/api/dictionaries/transport-methods');
};

export const getContainers = async () => {
  try {
    console.log('Запрос контейнеров...');
    const response = await request('/api/dictionaries/containers');
    console.log('Контейнеры получены:', response);
    return response;
  } catch (error) {
    console.error('Ошибка получения контейнеров:', error);
    throw error;
  }
};

export const createVehicleAct = async (formData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/vehicle-acts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
  }

  if (!response.ok) {
    throw new Error('Failed to create vehicle act');
  }

  return response.json();
};

export const getCurrentUser = async () => {
  return request('/api/auth/me');
};


export const issueVehicle = async (actId, issueData) => {
  console.log('Sending issue request:', { actId, issueData });
  return request(`/vehicle-acts/${actId}/issue`, {
    method: 'POST',
    body: JSON.stringify(issueData),
  });
};

export const getCompanyVehicles = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const url = `/api/dictionaries/company-vehicles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return request(url);
  } catch (error) {
    console.error('Ошибка получения ТС перевозчиков:', error);
    throw error;
  }
};