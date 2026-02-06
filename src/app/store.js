import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import resourceReducer from "../features/resources/resourceSlice";
import folderReducer from "../features/folders/folderSlice";
import themeReducer from "../features/theme/themeSlice";
import organizeReducer from "../features/organise/organizeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        resources: resourceReducer,
        folders: folderReducer,
        theme: themeReducer,
        organize: organizeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/loadStoredAuth/fulfilled'],
            },
        }),
});

export { store };