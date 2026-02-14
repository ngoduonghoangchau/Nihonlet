import api from '../api/axios';
import type { ApiResponse } from '../types/auth';
import type {
  SystemDashboardDto,
  PaginatedResult,
  ApplicationLogDto,
  AuditLogDto,
  ApiRequestLogDto,
} from '../types/admin';

// ===== Dashboard tổng quan =====
export const getDashboard = async (): Promise<ApiResponse<SystemDashboardDto>> => {
  const response = await api.get<ApiResponse<SystemDashboardDto>>('/admin/dashboard');
  return response.data;
};

// ===== Application Logs =====
export const getApplicationLogs = async (params: {
  page?: number;
  pageSize?: number;
  level?: string;
  search?: string;
  from?: string;
  to?: string;
}): Promise<ApiResponse<PaginatedResult<ApplicationLogDto>>> => {
  const response = await api.get<ApiResponse<PaginatedResult<ApplicationLogDto>>>('/admin/logs/application', { params });
  return response.data;
};

// ===== Audit Logs =====
export const getAuditLogs = async (params: {
  page?: number;
  pageSize?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  from?: string;
  to?: string;
}): Promise<ApiResponse<PaginatedResult<AuditLogDto>>> => {
  const response = await api.get<ApiResponse<PaginatedResult<AuditLogDto>>>('/admin/logs/audit', { params });
  return response.data;
};

// ===== API Request Logs =====
export const getApiRequestLogs = async (params: {
  page?: number;
  pageSize?: number;
  method?: string;
  path?: string;
  statusCode?: number;
  minDurationMs?: number;
  from?: string;
  to?: string;
}): Promise<ApiResponse<PaginatedResult<ApiRequestLogDto>>> => {
  const response = await api.get<ApiResponse<PaginatedResult<ApiRequestLogDto>>>('/admin/logs/requests', { params });
  return response.data;
};
