import { createSelector } from "@reduxjs/toolkit";

const selectAuthState = (state) => state.auth;

export const selectUser = createSelector(
    [selectAuthState],
    (auth) => auth.user
);

export const selectToken = createSelector(
    [selectAuthState],
    (auth) => auth.token
);

export const selectIsAuthenticated = createSelector(
    [selectAuthState],
    (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
    [selectAuthState],
    (auth) => auth.loading
);

export const selectAuthError = createSelector(
    [selectAuthState],
    (auth) => auth.error
);