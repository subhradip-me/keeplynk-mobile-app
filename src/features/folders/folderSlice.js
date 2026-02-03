import { createSlice } from "@reduxjs/toolkit";
import {
    fetchFolders,
    fetchFolderById,
    createFolder,
    updateFolder,
    deleteFolder,
} from './folderThunk';

const folderSlice = createSlice({
    name: "folders",
    initialState: {
        items: [],
        currentFolder: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentFolder: (state, action) => {
            state.currentFolder = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Folders
            .addCase(fetchFolders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFolders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFolders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch Folder By ID
            .addCase(fetchFolderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFolderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentFolder = action.payload;
            })
            .addCase(fetchFolderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Create Folder
            .addCase(createFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update Folder
            .addCase(updateFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFolder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(f => f._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.currentFolder?._id === action.payload._id) {
                    state.currentFolder = action.payload;
                }
            })
            .addCase(updateFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete Folder
            .addCase(deleteFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(f => f._id !== action.payload);
                if (state.currentFolder?._id === action.payload) {
                    state.currentFolder = null;
                }
            })
            .addCase(deleteFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, setCurrentFolder } = folderSlice.actions;
export default folderSlice.reducer;
