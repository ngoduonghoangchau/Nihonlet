import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { setCredentials, logout } from '../store/slices/authSlice';
import { refreshToken as refreshTokenApi } from '../services/authService';

// ===== Constants =====
const CHECK_INTERVAL_MS = 30 * 1000; // Check every 30 seconds
const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000; // Refresh 2 minutes before expiry

export const useTokenRefresh = () => {
  const dispatch = useAppDispatch();
  const { accessToken, expiresAt, user } = useAppSelector((state) => state.auth);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRefreshingRef = useRef(false);

  // ===== Refresh Token Function =====
  const performRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    
    isRefreshingRef.current = true;
    try {
      const response = await refreshTokenApi();
      if (response.success && response.data) {
        dispatch(setCredentials({
          accessToken: response.data.accessToken,
          expiresAt: response.data.expiresAt,
          user: response.data.user,
        }));
      } else {
        dispatch(logout());
      }
    } catch {
      dispatch(logout());
    } finally {
      isRefreshingRef.current = false;
    }
  }, [dispatch]);

  // ===== Check if token needs refresh =====
  const checkAndRefreshToken = useCallback(() => {
    if (!expiresAt || !accessToken) return;
    
    const now = Date.now();
    const expiryTime = new Date(expiresAt).getTime();
    const timeUntilExpiry = expiryTime - now;
    
    // Refresh if token expires within REFRESH_BEFORE_EXPIRY_MS
    if (timeUntilExpiry <= REFRESH_BEFORE_EXPIRY_MS && timeUntilExpiry > 0) {
      performRefresh();
    }
  }, [expiresAt, accessToken, performRefresh]);

  // ===== Initial refresh on mount if user exists but no token =====
  useEffect(() => {
    if (user && !accessToken && !isRefreshingRef.current) {
      performRefresh();
    }
  }, [user, accessToken, performRefresh]);

  // ===== Set up interval for proactive refresh =====
  useEffect(() => {
    if (!accessToken) {
      // Clear interval if no token
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start interval check
    intervalRef.current = setInterval(checkAndRefreshToken, CHECK_INTERVAL_MS);
    
    // Also check immediately
    checkAndRefreshToken();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [accessToken, checkAndRefreshToken]);

  return { performRefresh };
};

export default useTokenRefresh;
