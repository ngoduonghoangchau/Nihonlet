// ===== Admin System Log Types =====

export interface SystemDashboardDto {
  totalApiRequests: number;
  totalErrors: number;
  totalWarnings: number;
  totalAuditActions: number;
  averageResponseTimeMs: number;
  requestsLast24h: number;
  errorsLast24h: number;
  slowestEndpoints: SlowEndpointDto[];
  statusCodeDistribution: StatusCodeDistributionDto[];
  recentAuditLogs: AuditLogDto[];
  recentErrors: ApplicationLogDto[];
  requestsPerHour: HourlyStatDto[];
}

export interface SlowEndpointDto {
  method: string;
  path: string;
  averageDurationMs: number;
  requestCount: number;
}

export interface StatusCodeDistributionDto {
  statusCode: number;
  count: number;
}

export interface HourlyStatDto {
  hour: string;
  requestCount: number;
  errorCount: number;
}

export interface ApplicationLogDto {
  id: string;
  level: string;
  message: string;
  source: string;
  userId?: string;
  requestPath?: string;
  correlationId?: string;
  exception?: ExceptionDetailDto;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface ExceptionDetailDto {
  type: string;
  message: string;
  stackTrace?: string;
  innerException?: ExceptionDetailDto;
}

export interface AuditLogDto {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  result: string;
  failureReason?: string;
  timestamp: string;
}

export interface ApiRequestLogDto {
  id: string;
  method: string;
  path: string;
  queryString?: string;
  statusCode: number;
  durationMs: number;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  responseSize?: number;
  correlationId?: string;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
