import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { setCredentials, setLoading, setError, logout as logoutAction } from '../store/slices/authSlice';
import * as authService from '../services/authService';
import type { ApiResponse, AuthResponseDto, LoginDto, RegisterDto, User } from '../types/auth';

/** Result returned from auth actions (login, register, googleLogin) */
interface AuthResult {
  success: boolean;
  error?: string;
  errors?: Record<string, string[]>;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error, accessToken, expiresAt } = useAppSelector(
    (state) => state.auth
  );

  /**
   * Shared handler that wraps any auth service call with
   * loading state, credential dispatch, and error handling.
   */
  const handleAuthAction = useCallback(
    async (
      action: () => Promise<ApiResponse<AuthResponseDto>>,
      fallbackMessage: string,
    ): Promise<AuthResult> => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const response = await action();
        if (response.success && response.data) {
          dispatch(setCredentials({
            accessToken: response.data.accessToken,
            expiresAt: response.data.expiresAt,
            user: response.data.user,
          }));
          return { success: true };
        }
        const errorMessage = response.message || fallbackMessage;
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage, errors: response.errors };
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
      }
    },
    [dispatch]
  );

  // ===== Login =====
  const login = useCallback(
    (credentials: LoginDto) =>
      handleAuthAction(() => authService.login(credentials), 'Login failed'),
    [handleAuthAction]
  );

  // ===== Register =====
  const register = useCallback(
    (data: RegisterDto) =>
      handleAuthAction(() => authService.register(data), 'Registration failed'),
    [handleAuthAction]
  );

  // ===== Google Login =====
  const googleLogin = useCallback(
    (idToken: string) =>
      handleAuthAction(() => authService.googleLogin(idToken), 'Google login failed'),
    [handleAuthAction]
  );

  // ===== Refresh Token =====
  const refreshTokenFn = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await authService.refreshToken();
      if (response.success && response.data) {
        dispatch(setCredentials({
          accessToken: response.data.accessToken,
          expiresAt: response.data.expiresAt,
          user: response.data.user,
        }));
        return true;
      }
      return false;
    } catch {
      dispatch(logoutAction());
      return false;
    }
  }, [dispatch]);

  // ===== Logout =====
  const logout = useCallback(async () => {
    try {
      await authService.logoutApi();
    } catch {
      // Ignore API errors on logout
    } finally {
      dispatch(logoutAction());
    }
  }, [dispatch]);

  // ===== Logout All Devices =====
  const logoutAllDevices = useCallback(async () => {
    try {
      await authService.logoutAllDevices();
    } catch {
      // Ignore API errors
    } finally {
      dispatch(logoutAction());
    }
  }, [dispatch]);

  return {
    user: user as User | null,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    expiresAt,
    login,
    register,
    googleLogin,
    refreshToken: refreshTokenFn,
    logout,
    logoutAllDevices,
  };
};

// ===== Helper to extract error message =====
function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    // Axios error with response
    if ('response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
    }
    // Standard Error
    if ('message' in error) {
      return (error as Error).message;
    }
  }
  return 'An unexpected error occurred';
}

export default useAuth;
