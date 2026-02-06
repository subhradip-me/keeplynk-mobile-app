import { createSlice } from "@reduxjs/toolkit";
import { autoOrganizeResources } from './organizeThunk';

const organizeSlice = createSlice({
    name: "organize",
    initialState: {
        autoOrganizing: false,
        autoOrganizeStatus: null,
        autoOrganizeMessage: null,
        autoOrganizeLimit: null,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearAutoOrganizeStatus: (state) => {
            state.autoOrganizeStatus = null;
            state.autoOrganizeMessage = null;
            state.autoOrganizeLimit = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Auto Organize Resources
            .addCase(autoOrganizeResources.pending, (state) => {
                state.autoOrganizing = true;
                state.error = null;
            })
            .addCase(autoOrganizeResources.fulfilled, (state, action) => {
                state.autoOrganizing = false;
                state.autoOrganizeStatus = action.payload.status;
                state.autoOrganizeMessage = action.payload.message;
                state.autoOrganizeLimit = action.payload.limit;
            })
            .addCase(autoOrganizeResources.rejected, (state, action) => {
                state.autoOrganizing = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearAutoOrganizeStatus } = organizeSlice.actions;
export default organizeSlice.reducer;
