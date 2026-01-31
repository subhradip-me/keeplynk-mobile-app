import { createSlice } from "@reduxjs/toolkit";
import { 
    loadStoredAuth, 
    register, 
    login, 
    logout, 
    addPersona, 
    switchPersona 
} from './authThunk';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: true,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Load Stored Auth
            .addCase(loadStoredAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadStoredAuth.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.isAuthenticated = true;
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                } else {
                    state.isAuthenticated = false;
                    state.user = null;
                    state.token = null;
                }
            })
            .addCase(loadStoredAuth.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.loading = false;
                state.error = null;
            })
            // Add Persona
            .addCase(addPersona.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPersona.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
                state.token = action.payload.token;
            })
            .addCase(addPersona.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Switch Persona
            .addCase(switchPersona.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(switchPersona.fulfilled, (state, action) => {
                state.loading = false;
                state.user.currentPersona = action.payload.currentPersona;
                state.token = action.payload.token;
            })
            .addCase(switchPersona.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;