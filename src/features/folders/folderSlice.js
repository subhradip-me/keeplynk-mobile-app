import { createSlice } from "@reduxjs/toolkit";
import {
    fetchFolders,
    fetchFolderById,
    createFolder,
    updateFolder,
    deleteFolder,
    trashFolder,
    restoreFolder,
    hardDeleteFolder,
    fetchTrashedFolders,
} from './folderThunk';

const folderSlice = createSlice({
    name: "folders",
    initialState: {
        items: [],
        trashedItems: [],
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

            // Delete Folder (legacy hard delete)
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
            })

            // Soft Delete (Trash) Folder
            .addCase(trashFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(trashFolder.fulfilled, (state, action) => {
                state.loading = false;
                const trashedFolder = action.payload;
                
                // Remove from items (active folders)
                state.items = state.items.filter(f => f._id !== trashedFolder._id);
                
                // Add to trashedItems
                const trashIndex = state.trashedItems.findIndex(f => f._id === trashedFolder._id);
                if (trashIndex !== -1) {
                    // Update if exists
                    state.trashedItems[trashIndex] = trashedFolder;
                } else {
                    // Add if not exists
                    state.trashedItems.push(trashedFolder);
                }
                
                if (state.currentFolder?._id === trashedFolder._id) {
                    state.currentFolder = null;
                }
            })
            .addCase(trashFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Restore Folder from Trash
            .addCase(restoreFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(restoreFolder.fulfilled, (state, action) => {
                state.loading = false;
                const restoredFolder = action.payload;
                
                console.log('Restoring folder:', restoredFolder);
                
                // Remove from trashedItems
                state.trashedItems = state.trashedItems.filter(f => f._id !== restoredFolder._id);
                
                // Add to items (active folders)
                const index = state.items.findIndex(f => f._id === restoredFolder._id);
                if (index !== -1) {
                    // Update if exists
                    state.items[index] = restoredFolder;
                    console.log('Updated existing folder in items');
                } else {
                    // Add if not exists
                    state.items.push(restoredFolder);
                    console.log('Added new folder to items');
                }
                
                console.log('Items count:', state.items.length, 'Trashed count:', state.trashedItems.length);
                
                if (state.currentFolder?._id === restoredFolder._id) {
                    state.currentFolder = restoredFolder;
                }
            })
            .addCase(restoreFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Hard Delete Folder (permanent)
            .addCase(hardDeleteFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(hardDeleteFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(f => f._id !== action.payload);
                state.trashedItems = state.trashedItems.filter(f => f._id !== action.payload);
                if (state.currentFolder?._id === action.payload) {
                    state.currentFolder = null;
                }
            })
            .addCase(hardDeleteFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Trashed Folders
            .addCase(fetchTrashedFolders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrashedFolders.fulfilled, (state, action) => {
                state.loading = false;
                state.trashedItems = action.payload;
            })
            .addCase(fetchTrashedFolders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, setCurrentFolder } = folderSlice.actions;
export default folderSlice.reducer;
