import api from '../api/axios';
import { getDeviceInfo } from '../utils/fingerprint';
import type {
  ApiResponse,
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  User,
  SessionDto,
  GoogleLoginRequest,
} from '../types/auth';

// ===== Login =====
export const login = async (credentials: LoginDto): Promise<ApiResponse<AuthResponseDto>> => {
  const deviceInfo = await getDeviceInfo();
  const response = await api.post<ApiResponse<AuthResponseDto>>('/auth/login', {
    login: credentials,
    deviceInfo,
  });
  return response.data;
};

// ===== Register =====
export const register = async (data: RegisterDto): Promise<ApiResponse<AuthResponseDto>> => {
  const deviceInfo = await getDeviceInfo();
  const response = await api.post<ApiResponse<AuthResponseDto>>('/auth/register', {
    register: data,
    deviceInfo,
  });
  return response.data;
};

// ===== Refresh Token =====
export const refreshToken = async (): Promise<ApiResponse<AuthResponseDto>> => {
  const deviceInfo = await getDeviceInfo();
  const response = await api.post<ApiResponse<AuthResponseDto>>('/auth/refresh-token', deviceInfo);
  return response.data;
};

// ===== Get Current User =====
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data;
};

// ===== Logout =====
export const logoutApi = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/auth/logout');
  return response.data;
};

// ===== Logout All Devices =====
export const logoutAllDevices = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/auth/logout-all');
  return response.data;
};

// ===== Get Sessions =====
export const getSessions = async (): Promise<ApiResponse<SessionDto[]>> => {
  const deviceInfo = await getDeviceInfo();
  const response = await api.get<ApiResponse<SessionDto[]>>('/auth/sessions', {
    params: { fingerprint: deviceInfo.fingerprint },
  });
  return response.data;
};

// ===== Revoke Session =====
export const revokeSession = async (sessionId: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/sessions/${sessionId}`);
  return response.data;
};

// ===== Google OAuth Login =====
export const googleLogin = async (idToken: string): Promise<ApiResponse<AuthResponseDto>> => {
  const deviceInfo = await getDeviceInfo();
  const request: GoogleLoginRequest = {
    idToken,
    deviceInfo,
  };
  const response = await api.post<ApiResponse<AuthResponseDto>>('/auth/google', request);
  return response.data;
};
