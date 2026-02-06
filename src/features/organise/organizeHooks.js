import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
    selectAutoOrganizing,
    selectAutoOrganizeStatus,
    selectAutoOrganizeMessage,
    selectAutoOrganizeLimit,
    selectOrganizeError,
} from './organizeSelector';
import { autoOrganizeResources } from './organizeThunk';
import { clearError, clearAutoOrganizeStatus } from './organizeSlice';

// Hook to get organize state
export const useOrganize = () => {
    return useSelector((state) => state.organize);
};

// Hook to get auto organizing status
export const useAutoOrganizing = () => {
    return useSelector(selectAutoOrganizing);
};

// Hook to get auto organize status
export const useAutoOrganizeStatus = () => {
    return useSelector(selectAutoOrganizeStatus);
};

// Hook to get auto organize message
export const useAutoOrganizeMessage = () => {
    return useSelector(selectAutoOrganizeMessage);
};

// Hook to get organize error
export const useOrganizeError = () => {
    return useSelector(selectOrganizeError);
};

// Hook to trigger auto organize
export const useAutoOrganize = () => {
    const dispatch = useDispatch();

    const autoOrganize = useCallback((limit = 50) => {
        return dispatch(autoOrganizeResources(limit));
    }, [dispatch]);

    return autoOrganize;
};

// Hook to clear organize error
export const useClearOrganizeError = () => {
    const dispatch = useDispatch();

    const clearOrganizeError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    return clearOrganizeError;
};

// Hook to clear auto organize status
export const useClearAutoOrganizeStatus = () => {
    const dispatch = useDispatch();

    const clearStatus = useCallback(() => {
        dispatch(clearAutoOrganizeStatus());
    }, [dispatch]);

    return clearStatus;
};
