import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchFolders as fetchFoldersAction,
    fetchFolderById as fetchFolderByIdAction,
    createFolder as createFolderAction,
    updateFolder as updateFolderAction,
    deleteFolder as deleteFolderAction,
} from './folderThunk';
import { clearError, setCurrentFolder } from './folderSlice';
import {
    selectFolders,
    selectCurrentFolder,
    selectFoldersLoading,
    selectFoldersError,
} from './folderSelector';

// Custom hook for folders
export const useFolders = () => {
    const dispatch = useDispatch();
    const folders = useSelector(selectFolders);
    const currentFolder = useSelector(selectCurrentFolder);
    const loading = useSelector(selectFoldersLoading);
    const error = useSelector(selectFoldersError);

    const fetchFolders = useCallback(() => dispatch(fetchFoldersAction()), [dispatch]);
    const fetchFolderById = useCallback((id) => dispatch(fetchFolderByIdAction(id)), [dispatch]);
    const createFolder = useCallback((folderData) => dispatch(createFolderAction(folderData)), [dispatch]);
    const updateFolder = useCallback((id, folderData) => dispatch(updateFolderAction({ id, folderData })), [dispatch]);
    const deleteFolder = useCallback((id) => dispatch(deleteFolderAction(id)), [dispatch]);
    const setCurrentFolderCallback = useCallback((folder) => dispatch(setCurrentFolder(folder)), [dispatch]);
    const clearErrorCallback = useCallback(() => dispatch(clearError()), [dispatch]);

    return {
        folders,
        currentFolder,
        loading,
        error,
        fetchFolders,
        fetchFolderById,
        createFolder,
        updateFolder,
        deleteFolder,
        setCurrentFolder: setCurrentFolderCallback,
        clearError: clearErrorCallback,
    };
};
