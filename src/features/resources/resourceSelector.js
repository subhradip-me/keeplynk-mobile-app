import { createSelector } from "@reduxjs/toolkit";

const selectResourceState = (state) => state.resources;

export const selectResources = createSelector(
    [selectResourceState],
    (resources) => resources.items
);

export const selectCurrentResource = createSelector(
    [selectResourceState],
    (resources) => resources.currentResource
);

export const selectSearchResults = createSelector(
    [selectResourceState],
    (resources) => resources.searchResults
);

export const selectResourcesLoading = createSelector(
    [selectResourceState],
    (resources) => resources.loading
);

export const selectResourcesError = createSelector(
    [selectResourceState],
    (resources) => resources.error
);