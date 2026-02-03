import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchResources as fetchResourcesAction,
    fetchResourceById as fetchResourceByIdAction,
    createResource as createResourceAction,
    updateResource as updateResourceAction,
    deleteResource as deleteResourceAction,
    searchResources as searchResourcesAction,
    moveResourceToTrash as moveResourceToTrashAction,
    restoreResourceFromTrash as restoreResourceFromTrashAction,
} from './resourceThunk';
import { 
    clearError, 
    clearSearchResults, 
    setCurrentResource,
} from './resourceSlice';
import {
    selectResources,
    selectCurrentResource,
    selectSearchResults,
    selectResourcesLoading,
    selectResourcesError,
} from './resourceSelector';

// Custom hook for resources
export const useResources = () => {
    const dispatch = useDispatch();
    const resources = useSelector(selectResources);
    const currentResource = useSelector(selectCurrentResource);
    const searchResults = useSelector(selectSearchResults);
    const loading = useSelector(selectResourcesLoading);
    const error = useSelector(selectResourcesError);

    const fetchResources = useCallback((params) => dispatch(fetchResourcesAction(params)), [dispatch]);
    const fetchResourceById = useCallback((id) => dispatch(fetchResourceByIdAction(id)), [dispatch]);
    const createResource = useCallback((resourceData) => dispatch(createResourceAction(resourceData)), [dispatch]);
    const updateResource = useCallback((id, resourceData) => dispatch(updateResourceAction({ id, resourceData })), [dispatch]);
    const deleteResource = useCallback((id) => dispatch(deleteResourceAction(id)), [dispatch]);
    const moveToTrash = useCallback((id) => dispatch(moveResourceToTrashAction(id)), [dispatch]);
    const restoreFromTrash = useCallback((id) => dispatch(restoreResourceFromTrashAction(id)), [dispatch]);
    const searchResources = useCallback((query, params) => dispatch(searchResourcesAction({ query, params })), [dispatch]);
    const setCurrentResourceCallback = useCallback((resource) => dispatch(setCurrentResource(resource)), [dispatch]);
    const clearErrorCallback = useCallback(() => dispatch(clearError()), [dispatch]);
    const clearSearchResultsCallback = useCallback(() => dispatch(clearSearchResults()), [dispatch]);

    return {
        resources,
        currentResource,
        searchResults,
        loading,
        error,
        fetchResources,
        fetchResourceById,
        createResource,
        updateResource,
        deleteResource,
        moveToTrash,
        restoreFromTrash,
        searchResources,
        setCurrentResource: setCurrentResourceCallback,
        clearError: clearErrorCallback,
        clearSearchResults: clearSearchResultsCallback,
    };
};
