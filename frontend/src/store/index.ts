import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import authReducer from './slices/authSlice';

// ===== Root Reducer =====
const rootReducer = combineReducers({
  auth: authReducer,
});

// ===== Persist Config =====
// Only persist user info, NOT accessToken (security best practice)
const persistConfig = {
  key: 'nihonlet',
  version: 1,
  storage,
  whitelist: ['auth'], // Persist auth slice
  // Transform to exclude sensitive data
  transforms: [
    {
      // Before persisting to storage
      in: (state: ReturnType<typeof authReducer>, key: string) => {
        if (key === 'auth') {
          // Only persist user, exclude tokens
          return {
            ...state,
            accessToken: null,
            expiresAt: null,
            isLoading: false,
            error: null,
          };
        }
        return state;
      },
      // After retrieving from storage  
      out: (state: ReturnType<typeof authReducer>, key: string) => {
        if (key === 'auth') {
          // Restore with isLoading true if user exists (need to refresh token)
          return {
            ...state,
            isAuthenticated: false, // Will be set after token refresh
            isLoading: !!state.user, // Loading if user exists
          };
        }
        return state;
      },
    },
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ===== Store =====
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

// ===== Persistor =====
export const persistor = persistStore(store);

// ===== Types =====
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
