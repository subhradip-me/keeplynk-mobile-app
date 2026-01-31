import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../../services/api';

// Load stored auth
export const loadStoredAuth = createAsyncThunk(
    'auth/loadStoredAuth',
    async (_, { rejectWithValue }) => {
        try {
            const storedToken = await AsyncStorage.getItem('auth_token');
            const storedUser = await AsyncStorage.getItem('user_data'); 
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
                await AsyncStorage.setItem('auth_token', response.data.token);
                await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
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
                await AsyncStorage.setItem('auth_token', response.data.token);
                await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
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
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');
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
                await AsyncStorage.setItem('auth_token', response.data.token);
                await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
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
                await AsyncStorage.setItem('auth_token', response.data.token);
                await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
                apiService.setToken(response.data.token);
                return response.data;
            }
            
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);