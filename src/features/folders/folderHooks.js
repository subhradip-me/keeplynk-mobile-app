import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchFolders as fetchFoldersAction,
    fetchFolderById as fetchFolderByIdAction,
    createFolder as createFolderAction,
    updateFolder as updateFolderAction,
    deleteFolder as deleteFolderAction,
    trashFolder as trashFolderAction,
    restoreFolder as restoreFolderAction,
    hardDeleteFolder as hardDeleteFolderAction,
    fetchTrashedFolders as fetchTrashedFoldersAction,
} from './folderThunk';
import { clearError, setCurrentFolder } from './folderSlice';
import {
    selectFolders,
    selectCurrentFolder,
    selectFoldersLoading,
    selectFoldersError,
    selectTrashedFolders,
} from './folderSelector';

// Custom hook for folders
export const useFolders = () => {
    const dispatch = useDispatch();
    const folders = useSelector(selectFolders);
    const trashedFolders = useSelector(selectTrashedFolders);
    const currentFolder = useSelector(selectCurrentFolder);
    const loading = useSelector(selectFoldersLoading);
    const error = useSelector(selectFoldersError);

    const fetchFolders = useCallback(() => dispatch(fetchFoldersAction()), [dispatch]);
    const fetchFolderById = useCallback((id) => dispatch(fetchFolderByIdAction(id)), [dispatch]);
    const fetchTrashedFolders = useCallback(() => dispatch(fetchTrashedFoldersAction()), [dispatch]);
    const createFolder = useCallback((folderData) => dispatch(createFolderAction(folderData)), [dispatch]);
    const updateFolder = useCallback((id, folderData) => dispatch(updateFolderAction({ id, folderData })), [dispatch]);
    const deleteFolder = useCallback((id) => dispatch(deleteFolderAction(id)), [dispatch]);
    const moveToTrash = useCallback((id) => dispatch(trashFolderAction(id)), [dispatch]);
    const restoreFromTrash = useCallback((id) => dispatch(restoreFolderAction(id)), [dispatch]);
    const permanentDelete = useCallback((id) => dispatch(hardDeleteFolderAction(id)), [dispatch]);
    const setCurrentFolderCallback = useCallback((folder) => dispatch(setCurrentFolder(folder)), [dispatch]);
    const clearErrorCallback = useCallback(() => dispatch(clearError()), [dispatch]);

    return {
        folders,
        trashedFolders,
        currentFolder,
        loading,
        error,
        fetchFolders,
        fetchFolderById,
        fetchTrashedFolders,
        createFolder,
        updateFolder,
        deleteFolder,
        moveToTrash,
        restoreFromTrash,
        permanentDelete,
        // Aliases for convenience
        trashFolder: moveToTrash,
        restoreFolder: restoreFromTrash,
        hardDeleteFolder: permanentDelete,
        setCurrentFolder: setCurrentFolderCallback,
        clearError: clearErrorCallback,
    };
};
