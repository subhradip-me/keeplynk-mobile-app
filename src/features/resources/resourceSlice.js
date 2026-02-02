import { createSlice } from "@reduxjs/toolkit";
import {
    fetchResources,
    fetchResourceById,
    createResource,
    updateResource,
    deleteResource,
    searchResources,
    makeResourceFavorite,
} from './resourceThunk';

// Helper function to deduplicate resources
const deduplicateResources = (resources) => {
    const resourceMap = new Map();
    (resources || []).forEach(resource => {
        const id = resource._id || resource.id;
        if (id) {
            resourceMap.set(id, resource);
        }
    });
    return Array.from(resourceMap.values());
};

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
                state.items = deduplicateResources(action.payload);
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
                const newResource = action.payload;
                const id = newResource._id || newResource.id;
                const exists = state.items.some(r => (r._id || r.id) === id);
                if (!exists) {
                    state.items.push(newResource);
                }
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
                const updatedResource = action.payload;
                const resourceId = updatedResource._id || updatedResource.id;
                const index = state.items.findIndex(r => (r._id || r.id) === resourceId);
                if (index !== -1) {
                    state.items[index] = updatedResource;
                }
                const currentId = state.currentResource?._id || state.currentResource?.id;
                if (currentId === resourceId) {
                    state.currentResource = updatedResource;
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
                const deletedId = action.payload;
                state.items = state.items.filter(r => (r._id || r.id) !== deletedId);
                const currentId = state.currentResource?._id || state.currentResource?.id;
                if (currentId === deletedId) {
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
            })
            
            // Make Resources Favorite
            .addCase(makeResourceFavorite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(makeResourceFavorite.fulfilled, (state, action) => {
                state.loading = false;
                const updatedResource = action.payload;
                const resourceId = updatedResource._id || updatedResource.id;
                const index = state.items.findIndex(r => (r._id || r.id) === resourceId);
                if (index !== -1) {
                    state.items[index] = updatedResource;
                }
                const currentId = state.currentResource?._id || state.currentResource?.id;
                if (currentId === resourceId) {
                    state.currentResource = updatedResource;
                }
                // Deduplicate after update
                state.items = deduplicateResources(state.items);
            })
            .addCase(makeResourceFavorite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSearchResults, setCurrentResource } = resourceSlice.actions;
export default resourceSlice.reducer;