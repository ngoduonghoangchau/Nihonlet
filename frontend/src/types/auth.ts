// ===== API Response Wrapper =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

// ===== User =====
export interface User {
  id: string;
  email: string;
  fullName: string;
  level: number;
  currentXp: number;
  avatarUrl?: string;
  roles: string[];
  isPremium: boolean;
}

// ===== Auth Response (Login/Register/Refresh) =====
export interface AuthResponseDto {
  accessToken: string;
  expiresAt: string;
  user: User;
}

// ===== Device Info =====
export interface DeviceInfoDto {
  fingerprint: string;
  deviceName?: string;
}

// ===== Login Request =====
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginWithDeviceRequest {
  login: LoginDto;
  deviceInfo: DeviceInfoDto;
}

// ===== Register Request =====
export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface RegisterWithDeviceRequest {
  register: RegisterDto;
  deviceInfo: DeviceInfoDto;
}

// ===== Session =====
export interface SessionDto {
  id: string;
  deviceName?: string;
  deviceFingerprint: string;
  ipAddress?: string;
  createdAt: string;
  lastUsedAt: string;
  isCurrent: boolean;
}

// ===== Google OAuth =====
export interface GoogleLoginRequest {
  idToken: string;
  deviceInfo: DeviceInfoDto;
}

// ===== Auth State (Redux) =====
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
