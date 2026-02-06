import { createAsyncThunk } from "@reduxjs/toolkit";
import organizeAPI from "../../services/organize";

// Auto organize resources
export const autoOrganizeResources = createAsyncThunk(
    'organize/autoOrganize',
    async (limit = 50, { rejectWithValue }) => {
        try {
            const response = await organizeAPI.autoOrganize(limit);
            return response;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to auto organize resources');
        }
    }
);
