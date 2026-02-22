import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { store } from "../store";
import { setCredentials, logout } from "../store/slices/authSlice";
import { getDeviceInfo } from "../utils/fingerprint";
import type { ApiResponse, AuthResponseDto } from "../types/auth";

// ===== API Base URL =====
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5017/api";

// ===== Axios Instance =====
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for HttpOnly cookies (refresh token)
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Flag to prevent multiple refresh attempts =====
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ===== Request Interceptor: Attach Access Token =====
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ===== Response Interceptor: Handle 401 and Auto Refresh =====
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints (except /me)
      if (originalRequest.url?.includes("/auth/") && !originalRequest.url?.includes("/auth/me")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const deviceInfo = await getDeviceInfo();
        const response = await axios.post<ApiResponse<AuthResponseDto>>(
          `${API_BASE_URL}/auth/refresh-token`,
          deviceInfo,
          { withCredentials: true },
        );

        if (response.data.success && response.data.data) {
          const { accessToken, expiresAt, user } = response.data.data;

          // Update Redux store
          store.dispatch(setCredentials({ accessToken, expiresAt, user }));

          processQueue(null, accessToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } else {
          throw new Error("Refresh token failed");
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
