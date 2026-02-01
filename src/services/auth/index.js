/**
 * Authentication API
 * React Native version using in-memory storage replacement
 */
// Simple in-memory storage replacement for AsyncStorage
const memoryStorage = {
  data: {},
  setItem: async (key, value) => {
    memoryStorage.data[key] = value;
  },
  getItem: async (key) => {
    return memoryStorage.data[key] || null;
  },
  removeItem: async (key) => {
    delete memoryStorage.data[key];
  }
};

import apiService from '../api';
import { ApiTokenManager } from '../api/axios';

export const authAPI = {
  login: async (credentials) => {
    try {
      const data = await apiService.login(credentials);
      // apiService.login already returns response.data from axios
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;
      
      if (token && user) {
        await memoryStorage.setItem('auth_token', token);
        await memoryStorage.setItem('user_data', JSON.stringify(user));
        ApiTokenManager.setToken(token);
        return { token, user };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },
  register: async (userInfo) => {
    try {
      const data = await apiService.register(userInfo);
      // apiService.register already returns response.data from axios
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;
      
      if (token && user) {
        await memoryStorage.setItem('auth_token', token);
        await memoryStorage.setItem('user_data', JSON.stringify(user));
        ApiTokenManager.setToken(token);
        return { token, user };
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },
  logout: async () => {
    try {
      await memoryStorage.removeItem('auth_token');
      await memoryStorage.removeItem('user_data');
      ApiTokenManager.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  getProfile: async () => {
    return apiService.getProfile();
  },
  addPersona: async (persona) => {
    const response = await apiService.addPersona(persona);
    if (response.token) {
      await memoryStorage.setItem('auth_token', response.token);
      ApiTokenManager.setToken(response.token);
    }
    return response;
  },
  switchPersona: async (persona) => {
    const response = await apiService.switchPersona(persona);
    if (response.token) {
      await memoryStorage.setItem('auth_token', response.token);
      ApiTokenManager.setToken(response.token);
    }
    return response;
  },
  removePersona: async (persona) => {
    return apiService.removePersona(persona);
  },
  loadStoredAuth: async () => {
    try {
      const token = await memoryStorage.getItem('auth_token');
      const userData = await memoryStorage.getItem('user_data');
      if (token && userData) {
        ApiTokenManager.setToken(token);
        return {
          token,
          user: JSON.parse(userData),
        };
      }
      return null;
    } catch (error) {
      console.error('Load stored auth error:', error);
      return null;
    }
  },
};

export const Login = authAPI.login;
export const Register = authAPI.register;
export const Logout = authAPI.logout;
