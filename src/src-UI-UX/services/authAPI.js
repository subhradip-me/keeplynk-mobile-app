/**
 * Authentication API
 * React Native version using AsyncStorage instead of localStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './api';

export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} User data and token
   */
  login: async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      
      if (response.success) {
        // Store token and user in AsyncStorage (React Native equivalent of localStorage)
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
        apiService.setToken(response.data.token);
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Register new user
   * @param {Object} userInfo - { email, password, firstName, lastName, initialPersona }
   * @returns {Promise<Object>} User data and token
   */
  register: async (userInfo) => {
    try {
      const response = await apiService.register(userInfo);
      
      if (response.success) {
        // Store token and user in AsyncStorage
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
        apiService.setToken(response.data.token);
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  /**
   * Logout user
   * Clears stored token and user data
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      apiService.clearToken();
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    return apiService.getProfile();
  },

  /**
   * Add persona to user account
   * @param {string} persona - Persona name (student, professional, etc.)
   * @returns {Promise<Object>} Updated user data
   */
  addPersona: async (persona) => {
    const response = await apiService.addPersona(persona);
    
    if (response.data?.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
      apiService.setToken(response.data.token);
    }
    
    return response;
  },

  /**
   * Switch active persona
   * @param {string} persona - Persona name to switch to
   * @returns {Promise<Object>} Updated user data
   */
  switchPersona: async (persona) => {
    const response = await apiService.switchPersona(persona);
    
    if (response.data?.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
      apiService.setToken(response.data.token);
    }
    
    return response;
  },

  /**
   * Remove persona from user account
   * @param {string} persona - Persona name to remove
   * @returns {Promise<Object>} Updated user data
   */
  removePersona: async (persona) => {
    return apiService.removePersona(persona);
  },

  /**
   * Load stored authentication data
   * Called on app startup
   * @returns {Promise<Object|null>} Stored user data or null
   */
  loadStoredAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        apiService.setToken(token);
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

// Legacy exports for backward compatibility
export const Login = authAPI.login;
export const Register = authAPI.register;
export const Logout = authAPI.logout;
