import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../types/auth";

// ===== Initial State =====
const initialState: AuthState = {
  user: null,
  accessToken: null, // NOT persisted - memory only
  expiresAt: null, // NOT persisted - memory only
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ===== Auth Slice =====
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set credentials after login/register/refresh
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        expiresAt: string;
        user: User;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Update user info only (e.g., from /me endpoint)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Logout - clear all auth state
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // Rehydrate: Called when redux-persist restores state
    // Only user is persisted, so we need to try refresh token
    rehydrateAuth: (state) => {
      // If we have user but no token, we need to refresh
      if (state.user && !state.accessToken) {
        state.isAuthenticated = false; // Will be set to true after refresh
        state.isLoading = true;
      }
    },
  },
});

export const { setCredentials, setUser, setLoading, setError, logout, rehydrateAuth } = authSlice.actions;

export default authSlice.reducer;
