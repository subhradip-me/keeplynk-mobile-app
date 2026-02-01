import { createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from '../../services';

// Load stored auth
export const loadStoredAuth = createAsyncThunk(
    'auth/loadStoredAuth',
    async (_, { rejectWithValue }) => {
        try {
            const result = await authAPI.loadStoredAuth();
            return result;
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
            const response = await authAPI.register(userData);
            return response;
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
            const response = await authAPI.login(credentials);
            return response;
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
            await authAPI.logout();
            return null;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add Persona
export const addPersona = createAsyncThunk(
    'auth/addPersona',
    async (persona, { rejectWithValue }) => {
        try {
            const response = await authAPI.addPersona(persona);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Switch Persona
export const switchPersona = createAsyncThunk(
    'auth/switchPersona',
    async (persona, { rejectWithValue }) => {
        try {
            const response = await authAPI.switchPersona(persona);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);