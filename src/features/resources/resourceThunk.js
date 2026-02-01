import { createAsyncThunk } from "@reduxjs/toolkit";
import { resourcesAPI } from '../../services';

// Fetch all resources
export const fetchResources = createAsyncThunk(
    'resources/fetchResources',
    async (params = {}, { rejectWithValue }) => {
        try {
            const data = await resourcesAPI.getAll(params);
            return data.data || data;
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
            const data = await resourcesAPI.getById(id);
            return data.data || data;
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
            const data = await resourcesAPI.create(resourceData);
            return data.data || data;
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
            const data = await resourcesAPI.update(id, resourceData);
            return data.data || data;
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
            await resourcesAPI.delete(id);
            return id;
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
            const data = await resourcesAPI.search(query, params);
            return data.data || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);