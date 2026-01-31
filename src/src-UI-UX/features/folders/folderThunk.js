import { createAsyncThunk } from "@reduxjs/toolkit";
import apiService from '../../services/api';

// Fetch all folders
export const fetchFolders = createAsyncThunk(
    'folders/fetchFolders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.getFolders();
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single folder by ID
export const fetchFolderById = createAsyncThunk(
    'folders/fetchFolderById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiService.getFolderById(id);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create new folder
export const createFolder = createAsyncThunk(
    'folders/createFolder',
    async (folderData, { rejectWithValue }) => {
        try {
            const response = await apiService.createFolder(folderData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update folder
export const updateFolder = createAsyncThunk(
    'folders/updateFolder',
    async ({ id, folderData }, { rejectWithValue }) => {
        try {
            const response = await apiService.updateFolder(id, folderData);
            if (response.success) {
                return response.data;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Delete folder
export const deleteFolder = createAsyncThunk(
    'folders/deleteFolder',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiService.deleteFolder(id);
            if (response.success) {
                return id;
            }
            return rejectWithValue(response.message);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
