import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';

// 1. Định nghĩa Root Reducer trước
const rootReducer = combineReducers({
  auth: authReducer,
});

const authTransform = createTransform(
  (inboundState: any) => ({
    ...inboundState,
    accessToken: null,
    expiresAt: null,
    isLoading: false,
    error: null,
  }),
  (outboundState: any) => ({
    ...outboundState,
    isAuthenticated: false,
    isLoading: !!outboundState.user,
  }),
  { whitelist: ['auth'] }
);

const persistConfig = {
  key: 'nihonlet',
  version: 1,
  storage,
  whitelist: ['auth'],
  transforms: [authTransform],
};

// 2. Ép kiểu cho persistedReducer để tránh lỗi Reducer type mismatch
const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// 3. THAY ĐỔI DÒNG NÀY: Lấy type từ rootReducer thay vì store.getState
export type RootState = ReturnType<typeof rootReducer>; 
export type AppDispatch = typeof store.dispatch;