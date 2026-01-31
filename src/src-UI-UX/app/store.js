import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import resourceReducer from "../features/resources/resourceSlice";
import folderReducer from "../features/folders/folderSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        resources: resourceReducer,
        folders: folderReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/loadStoredAuth/fulfilled'],
            },
        }),
});

export default store;