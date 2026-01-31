import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from '../../services/api';

// Fetch all resources
export const fetchResources = createAsyncThunk(
    'resources/fetchResources',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await apiService.getResources(params);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single resource by ID
export const fetchResourceById = createAsyncThunk(
    'resources/fetchResourceById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiService.getResourceById(id);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create new resource
export const createResource = createAsyncThunk(
    'resources/createResource',
    async (resourceData, { rejectWithValue }) => {
        try {
            const response = await apiService.createResource(resourceData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update resource
export const updateResource = createAsyncThunk(
    'resources/updateResource',
    async ({ id, resourceData }, { rejectWithValue }) => {
        try {
            const response = await apiService.updateResource(id, resourceData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete resource
export const deleteResource = createAsyncThunk(
    'resources/deleteResource',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiService.deleteResource(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Search resources
export const searchResources = createAsyncThunk(
    'resources/searchResources',
    async ({ query, params = {} }, { rejectWithValue }) => {
        try {
            const response = await apiService.searchResources(query, params);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);