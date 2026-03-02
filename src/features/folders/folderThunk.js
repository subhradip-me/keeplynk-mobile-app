import { createAsyncThunk } from "@reduxjs/toolkit";
import { foldersAPI } from '../../services';

// Fetch all folders
export const fetchFolders = createAsyncThunk(
    'folders/fetchFolders',
    async (_, { rejectWithValue }) => {
        try {
            const data = await foldersAPI.getAll();
            // Handle both {success, data} and direct data responses
            return data.data || data;
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
            const data = await foldersAPI.getById(id);
            return data.data || data;
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
            const data = await foldersAPI.create(folderData);
            return data.data || data;
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
            const data = await foldersAPI.update(id, folderData);
            return data.data || data;
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
            await foldersAPI.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Soft delete (move to trash)
export const trashFolder = createAsyncThunk(
    'folders/trashFolder',
    async (id, { rejectWithValue }) => {
        try {
            const data = await foldersAPI.moveToTrash(id);
            return data.data || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Restore folder from trash
export const restoreFolder = createAsyncThunk(
    'folders/restoreFolder',
    async (id, { rejectWithValue }) => {
        try {
            const data = await foldersAPI.restoreFromTrash(id);
            return data.data || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Permanently delete folder
export const hardDeleteFolder = createAsyncThunk(
    'folders/hardDeleteFolder',
    async (id, { rejectWithValue }) => {
        try {
            await foldersAPI.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
