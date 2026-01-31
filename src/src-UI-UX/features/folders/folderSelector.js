import { createSelector } from "@reduxjs/toolkit";

const selectFolderState = (state) => state.folders;

export const selectFolders = createSelector(
    [selectFolderState],
    (folders) => folders.items
);

export const selectCurrentFolder = createSelector(
    [selectFolderState],
    (folders) => folders.currentFolder
);

export const selectFoldersLoading = createSelector(
    [selectFolderState],
    (folders) => folders.loading
);

export const selectFoldersError = createSelector(
    [selectFolderState],
    (folders) => folders.error
);
