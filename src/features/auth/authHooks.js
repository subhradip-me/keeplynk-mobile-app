import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useCallback } from 'react';
import {
    loadStoredAuth,
    register as registerAction,
    login as loginAction,
    logout as logoutAction,
    addPersona as addPersonaAction,
    switchPersona as switchPersonaAction,
} from './authThunk';
import { clearError } from './authSlice';
import {
    selectUser,
    selectToken,
    selectIsAuthenticated,
    selectAuthLoading,
    selectAuthError,
} from './authSelector';

// Custom hook
export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const token = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    const register = useCallback((userData) => dispatch(registerAction(userData)), [dispatch]);
    const login = useCallback((credentials) => dispatch(loginAction(credentials)), [dispatch]);
    const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);
    const addPersona = useCallback((persona) => dispatch(addPersonaAction(persona)), [dispatch]);
    const switchPersona = useCallback((persona) => dispatch(switchPersonaAction(persona)), [dispatch]);
    const clearErrorCallback = useCallback(() => dispatch(clearError()), [dispatch]);

    return {
        user,
        token,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        addPersona,
        switchPersona,
        clearError: clearErrorCallback,
    };
};

// Hook to initialize auth on app startup
export const useAuthInit = () => {
    const dispatch = useDispatch();
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            dispatch(loadStoredAuth());
        }
    }, [dispatch]);
};
