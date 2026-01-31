import { createSlice } from "@reduxjs/toolkit";
import {
    fetchResources,
    fetchResourceById,
    createResource,
    updateResource,
    deleteResource,
    searchResources,
} from './resourceThunk';

const resourceSlice = createSlice({
    name: "resources",
    initialState: {
        items: [],
        currentResource: null,
        searchResults: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        setCurrentResource: (state, action) => {
            state.currentResource = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Resources
            .addCase(fetchResources.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResources.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchResources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch Resource By ID
            .addCase(fetchResourceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResourceById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentResource = action.payload;
            })
            .addCase(fetchResourceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Create Resource
            .addCase(createResource.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createResource.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update Resource
            .addCase(updateResource.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateResource.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.currentResource?.id === action.payload.id) {
                    state.currentResource = action.payload;
                }
            })
            .addCase(updateResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete Resource
            .addCase(deleteResource.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(r => r.id !== action.payload);
                if (state.currentResource?.id === action.payload) {
                    state.currentResource = null;
                }
            })
            .addCase(deleteResource.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Search Resources
            .addCase(searchResources.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchResources.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchResources.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSearchResults, setCurrentResource } = resourceSlice.actions;
export default resourceSlice.reducer;