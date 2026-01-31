import { createAsyncThunk } from "@reduxjs/toolkit";

// Simple in-memory storage replacement for AsyncStorage
const simpleStorage = {
  data: {},
  getItem: async (key) => {
    return Promise.resolve(simpleStorage.data[key] || null);
  },
  setItem: async (key, value) => {
    simpleStorage.data[key] = value;
    return Promise.resolve();
  },
  removeItem: async (key) => {
    delete simpleStorage.data[key];
    return Promise.resolve();
  }
};

// Simple API service replacement
const apiService = {
  token: null,
  setToken: (token) => { apiService.token = token; },
  clearToken: () => { apiService.token = null; },
  register: async (userData) => {
    // Mock successful registration
    return {
      success: true,
      data: {
        token: 'mock-token-' + Date.now(),
        user: { 
          id: '1', 
          email: userData.email, 
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || 'Name'
        }
      }
    };
  },
  login: async (credentials) => {
    // Mock successful login
    return {
      success: true,
      data: {
        token: 'mock-token-' + Date.now(),
        user: { 
          id: '1', 
          email: credentials.email, 
          firstName: 'User',
          lastName: 'Name'
        }
      }
    };
  },
  addPersona: async (persona) => {
    // Mock add persona
    return {
      success: true,
      data: { token: 'mock-token-' + Date.now() }
    };
  },
  switchPersona: async (persona) => {
    // Mock switch persona
    return {
      success: true,
      data: { 
        token: 'mock-token-' + Date.now(),
        currentPersona: persona 
      }
    };
  }
};

// Load stored auth
export const loadStoredAuth = createAsyncThunk(
    'auth/loadStoredAuth',
    async (_, { rejectWithValue }) => {
        try {
            const storedToken = await simpleStorage.getItem('auth_token');
            const storedUser = await simpleStorage.getItem('user_data'); 
            if (storedToken && storedUser) {
                apiService.setToken(storedToken);
                return {
                    token: storedToken,
                    user: JSON.parse(storedUser)
                };
            }
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Register
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await apiService.register(userData);
            
            if (response.success) {
                await simpleStorage.setItem('auth_token', response.data.token);
                await simpleStorage.setItem('user_data', JSON.stringify(response.data.user));
                apiService.setToken(response.data.token);
                return response.data;
            }
            
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiService.login(credentials);
            
            if (response.success) {
                await simpleStorage.setItem('auth_token', response.data.token);
                await simpleStorage.setItem('user_data', JSON.stringify(response.data.user));
                apiService.setToken(response.data.token);
                return response.data;
            }
            
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await simpleStorage.removeItem('auth_token');
            await simpleStorage.removeItem('user_data');
            apiService.clearToken();
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add Persona
export const addPersona = createAsyncThunk(
    'auth/addPersona',
    async (persona, { getState, rejectWithValue }) => {
        try {
            const response = await apiService.addPersona(persona);
            
            if (response.success) {
                const { auth } = getState();
                const updatedUser = { ...auth.user, ...response.data };
                await simpleStorage.setItem('auth_token', response.data.token);
                await simpleStorage.setItem('user_data', JSON.stringify(updatedUser));
                apiService.setToken(response.data.token);
                return response.data;
            }
            
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Switch Persona
export const switchPersona = createAsyncThunk(
    'auth/switchPersona',
    async (persona, { getState, rejectWithValue }) => {
        try {
            const response = await apiService.switchPersona(persona);
            
            if (response.success) {
                const { auth } = getState();
                const updatedUser = { 
                    ...auth.user, 
                    currentPersona: response.data.currentPersona 
                };
                await simpleStorage.setItem('auth_token', response.data.token);
                await simpleStorage.setItem('user_data', JSON.stringify(updatedUser));
                apiService.setToken(response.data.token);
                return response.data;
            }
            
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);