const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Функция для выполнения запросов с авторизацией
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

  // Обработка ошибки 401 (Unauthorized)
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

// Получить акт по ID
export const getVehicleActById = async (id) => {
  return request(`/vehicle-acts/${id}`);
};

// Подтвердить прием ТС
export const confirmVehicleReceipt = async (actId) => {
  return request(`/vehicle-acts/${actId}/receive`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
};

// Другие функции API
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
  try {
    const token = localStorage.getItem('token');
    
    console.log('Token from localStorage:', token);
    
    if (!token || token === 'null' || token === 'undefined') {
      throw new Error('Токен не найден в localStorage');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/${userId}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ locationId }),
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
    }

    if (response.status === 403) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Недостаточно прав для выполнения операции');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error in selectLocation:', error);
    throw error;
  }
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

export const createVehicleAct = async (formData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/vehicle-acts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  // Обработка ошибки 401 и для этого запроса
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

// Добавим функцию для получения информации о текущем пользователе
export const getCurrentUser = async () => {
  return request('/api/auth/me');
};
