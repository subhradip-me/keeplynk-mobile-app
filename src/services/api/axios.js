import axios from 'axios';
import { API_CONFIG } from '../../config/api';

// Create Axios instance
const apiClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = ApiTokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400 && data.message?.includes('No active persona')) {
        return Promise.reject(new Error('PERSONA_REQUIRED: ' + (data.message || 'Please add a persona to your account')));
      }
      return Promise.reject(new Error(data.message || 'Request failed'));
    }
    return Promise.reject(error);
  }
);

// Token manager for modularity
class ApiTokenManager {
  static token = null;

  static setToken(token) {
    ApiTokenManager.token = token;
  }

  static getToken() {
    return ApiTokenManager.token;
  }

  static clearToken() {
    ApiTokenManager.token = null;
  }
}

export { apiClient, ApiTokenManager };
