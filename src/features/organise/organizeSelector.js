// Organize Selectors
export const selectOrganize = (state) => state.organize;

export const selectAutoOrganizing = (state) => state.organize?.autoOrganizing || false;

export const selectAutoOrganizeStatus = (state) => state.organize?.autoOrganizeStatus;

export const selectAutoOrganizeMessage = (state) => state.organize?.autoOrganizeMessage;

export const selectAutoOrganizeLimit = (state) => state.organize?.autoOrganizeLimit;

export const selectOrganizeError = (state) => state.organize?.error;
