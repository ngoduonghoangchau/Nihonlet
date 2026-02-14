import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  Server,
  Clock,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Zap,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';
import * as adminService from '../services/adminService';
import type {
  SystemDashboardDto,
  ApplicationLogDto,
  AuditLogDto,
  ApiRequestLogDto,
  PaginatedResult,
} from '../types/admin';

// ===== Tab types =====
type TabKey = 'overview' | 'app-logs' | 'audit-logs' | 'request-logs';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Tổng quan', icon: Activity },
  { key: 'app-logs', label: 'Application Logs', icon: AlertCircle },
  { key: 'audit-logs', label: 'Hành vi người dùng', icon: Users },
  { key: 'request-logs', label: 'API Requests', icon: Server },
];

// ===== Log level badge colors =====
const levelColor: Record<string, string> = {
  Info: 'bg-blue-100 text-blue-700',
  Warning: 'bg-yellow-100 text-yellow-700',
  Error: 'bg-red-100 text-red-700',
  Critical: 'bg-red-200 text-red-800',
  Debug: 'bg-gray-100 text-gray-600',
};

// ===== HTTP method badge colors =====
const methodColor: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  PATCH: 'bg-orange-100 text-orange-700',
  DELETE: 'bg-red-100 text-red-700',
};

// ===== Status code color =====
const statusColor = (code: number): string => {
  if (code < 300) return 'text-green-600';
  if (code < 400) return 'text-yellow-600';
  if (code < 500) return 'text-orange-600';
  return 'text-red-600 font-bold';
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const formatHour = (iso: string) => {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:00`;
};

// =============================================
// Main component
// =============================================
const AdminSystemStatus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [dashboard, setDashboard] = useState<SystemDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- App logs state ---
  const [appLogs, setAppLogs] = useState<PaginatedResult<ApplicationLogDto> | null>(null);
  const [appLogLevel, setAppLogLevel] = useState('');
  const [appLogSearch, setAppLogSearch] = useState('');
  const [appLogPage, setAppLogPage] = useState(1);

  // --- Audit logs state ---
  const [auditLogs, setAuditLogs] = useState<PaginatedResult<AuditLogDto> | null>(null);
  const [auditAction, setAuditAction] = useState('');
  const [auditEntity, setAuditEntity] = useState('');
  const [auditPage, setAuditPage] = useState(1);

  // --- Request logs state ---
  const [requestLogs, setRequestLogs] = useState<PaginatedResult<ApiRequestLogDto> | null>(null);
  const [reqMethod, setReqMethod] = useState('');
  const [reqMinDuration, setReqMinDuration] = useState('');
  const [reqPage, setReqPage] = useState(1);

  // ===========================================
  // Fetch functions
  // ===========================================
  const fetchDashboard = async () => {
    try {
      const res = await adminService.getDashboard();
      if (res.success && res.data) setDashboard(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  const fetchAppLogs = async (page = 1) => {
    try {
      const res = await adminService.getApplicationLogs({
        page,
        pageSize: 15,
        level: appLogLevel || undefined,
        search: appLogSearch || undefined,
      });
      if (res.success && res.data) setAppLogs(res.data);
    } catch (err) {
      console.error('Failed to load app logs:', err);
    }
  };

  const fetchAuditLogs = async (page = 1) => {
    try {
      const res = await adminService.getAuditLogs({
        page,
        pageSize: 15,
        action: auditAction || undefined,
        entityType: auditEntity || undefined,
      });
      if (res.success && res.data) setAuditLogs(res.data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };

  const fetchRequestLogs = async (page = 1) => {
    try {
      const res = await adminService.getApiRequestLogs({
        page,
        pageSize: 15,
        method: reqMethod || undefined,
        minDurationMs: reqMinDuration ? parseInt(reqMinDuration) : undefined,
      });
      if (res.success && res.data) setRequestLogs(res.data);
    } catch (err) {
      console.error('Failed to load request logs:', err);
    }
  };

  // ===========================================
  // Effects
  // ===========================================
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchDashboard();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (activeTab === 'app-logs') fetchAppLogs(appLogPage);
  }, [activeTab, appLogPage]);

  useEffect(() => {
    if (activeTab === 'audit-logs') fetchAuditLogs(auditPage);
  }, [activeTab, auditPage]);

  useEffect(() => {
    if (activeTab === 'request-logs') fetchRequestLogs(reqPage);
  }, [activeTab, reqPage]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'overview') await fetchDashboard();
    else if (activeTab === 'app-logs') await fetchAppLogs(appLogPage);
    else if (activeTab === 'audit-logs') await fetchAuditLogs(auditPage);
    else if (activeTab === 'request-logs') await fetchRequestLogs(reqPage);
    setRefreshing(false);
  };

  // ===========================================
  // Render
  // ===========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-background-light font-display text-[#1b0d14] min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-primary" size={32} />
              Tình Trạng Hệ Thống
            </h1>
            <p className="text-[#9a4c73] mt-1">Theo dõi toàn bộ hành vi hệ thống và người dùng</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#f3e7ed] rounded-xl text-sm font-bold text-[#9a4c73] hover:text-primary hover:border-primary transition-all"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-2xl border border-[#f3e7ed] p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-md'
                  : 'text-[#9a4c73] hover:bg-[#f3e7ed]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && dashboard && <OverviewTab data={dashboard} />}
        {activeTab === 'app-logs' && (
          <AppLogsTab
            data={appLogs}
            level={appLogLevel}
            setLevel={(v) => { setAppLogLevel(v); setAppLogPage(1); }}
            search={appLogSearch}
            setSearch={setAppLogSearch}
            onSearch={() => { setAppLogPage(1); fetchAppLogs(1); }}
            page={appLogPage}
            setPage={setAppLogPage}
          />
        )}
        {activeTab === 'audit-logs' && (
          <AuditLogsTab
            data={auditLogs}
            action={auditAction}
            setAction={(v) => { setAuditAction(v); setAuditPage(1); }}
            entity={auditEntity}
            setEntity={(v) => { setAuditEntity(v); setAuditPage(1); }}
            onSearch={() => { setAuditPage(1); fetchAuditLogs(1); }}
            page={auditPage}
            setPage={setAuditPage}
          />
        )}
        {activeTab === 'request-logs' && (
          <RequestLogsTab
            data={requestLogs}
            method={reqMethod}
            setMethod={(v) => { setReqMethod(v); setReqPage(1); }}
            minDuration={reqMinDuration}
            setMinDuration={setReqMinDuration}
            onSearch={() => { setReqPage(1); fetchRequestLogs(1); }}
            page={reqPage}
            setPage={setReqPage}
          />
        )}
      </div>
    </div>
  );
};

// =============================================
// Overview Tab
// =============================================
const OverviewTab: React.FC<{ data: SystemDashboardDto }> = ({ data }) => (
  <div className="space-y-8 animate-fadeIn">
    {/* Stats cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Server} label="Total API Requests" value={data.totalApiRequests.toLocaleString()} color="text-primary" />
      <StatCard icon={AlertCircle} label="Total Errors" value={data.totalErrors.toLocaleString()} color="text-red-500" />
      <StatCard icon={AlertTriangle} label="Total Warnings" value={data.totalWarnings.toLocaleString()} color="text-yellow-500" />
      <StatCard icon={Clock} label="Avg Response Time" value={`${data.averageResponseTimeMs}ms`} color="text-blue-500" />
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={Zap} label="Requests (24h)" value={data.requestsLast24h.toLocaleString()} color="text-green-500" />
      <StatCard icon={AlertCircle} label="Errors (24h)" value={data.errorsLast24h.toLocaleString()} color="text-red-400" />
      <StatCard icon={Users} label="Audit Actions" value={data.totalAuditActions.toLocaleString()} color="text-purple-500" />
    </div>

    {/* Requests per hour chart (simple bar) */}
    <div className="bg-white rounded-3xl border border-[#f3e7ed] p-6">
      <h3 className="text-sm font-bold text-[#9a4c73] uppercase tracking-widest mb-4">Requests / Hour (24h)</h3>
      <div className="flex items-end gap-1 h-32">
        {data.requestsPerHour.map((h, i) => {
          const maxReq = Math.max(...data.requestsPerHour.map(x => x.requestCount), 1);
          const pct = (h.requestCount / maxReq) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex flex-col items-center">
                <span className="text-[8px] text-[#9a4c73] opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5 whitespace-nowrap">
                  {h.requestCount} req / {h.errorCount} err
                </span>
                <div
                  className="w-full rounded-t bg-primary/70 group-hover:bg-primary transition-colors min-h-[2px]"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                />
              </div>
              {i % 3 === 0 && (
                <span className="text-[8px] text-[#9a4c73]">{formatHour(h.hour)}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status code distribution */}
      <div className="bg-white rounded-3xl border border-[#f3e7ed] p-6">
        <h3 className="text-sm font-bold text-[#9a4c73] uppercase tracking-widest mb-4">Status Code Distribution (24h)</h3>
        <div className="space-y-2">
          {data.statusCodeDistribution.map((s) => {
            const maxCount = Math.max(...data.statusCodeDistribution.map(x => x.count), 1);
            return (
              <div key={s.statusCode} className="flex items-center gap-3">
                <span className={`text-sm font-mono font-bold w-10 ${statusColor(s.statusCode)}`}>{s.statusCode}</span>
                <div className="flex-1 h-4 bg-[#f3e7ed] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.statusCode < 300 ? 'bg-green-400' : s.statusCode < 400 ? 'bg-yellow-400' : s.statusCode < 500 ? 'bg-orange-400' : 'bg-red-400'}`}
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#9a4c73] w-14 text-right">{s.count.toLocaleString()}</span>
              </div>
            );
          })}
          {data.statusCodeDistribution.length === 0 && <p className="text-sm text-[#9a4c73]">Chưa có dữ liệu</p>}
        </div>
      </div>

      {/* Slowest endpoints */}
      <div className="bg-white rounded-3xl border border-[#f3e7ed] p-6">
        <h3 className="text-sm font-bold text-[#9a4c73] uppercase tracking-widest mb-4 flex items-center gap-2">
          <ArrowUpDown size={14} /> Top 5 Slowest Endpoints (24h)
        </h3>
        <div className="space-y-3">
          {data.slowestEndpoints.map((ep, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${methodColor[ep.method] || 'bg-gray-100'}`}>{ep.method}</span>
              <span className="font-mono text-xs flex-1 truncate">{ep.path}</span>
              <span className="text-red-500 font-bold">{ep.averageDurationMs.toFixed(0)}ms</span>
              <span className="text-[#9a4c73] text-xs">({ep.requestCount} req)</span>
            </div>
          ))}
          {data.slowestEndpoints.length === 0 && <p className="text-sm text-[#9a4c73]">Chưa có dữ liệu</p>}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent errors */}
      <div className="bg-white rounded-3xl border border-[#f3e7ed] p-6">
        <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4">Lỗi Gần Nhất</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data.recentErrors.map((log) => (
            <div key={log.id} className="border-l-2 border-red-300 pl-3 py-1">
              <p className="text-xs font-bold text-red-600 truncate">{log.message}</p>
              <p className="text-[10px] text-[#9a4c73]">{log.source} • {formatDate(log.timestamp)}</p>
            </div>
          ))}
          {data.recentErrors.length === 0 && <p className="text-sm text-green-600 font-bold">Không có lỗi nào!</p>}
        </div>
      </div>

      {/* Recent audit */}
      <div className="bg-white rounded-3xl border border-[#f3e7ed] p-6">
        <h3 className="text-sm font-bold text-purple-500 uppercase tracking-widest mb-4">Hành Vi Người Dùng Gần Nhất</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data.recentAuditLogs.map((log) => (
            <div key={log.id} className="border-l-2 border-purple-200 pl-3 py-1">
              <p className="text-xs">
                <span className="font-bold">{log.action}</span> → {log.entityType}
                {log.entityId && <span className="text-[#9a4c73]"> #{log.entityId}</span>}
              </p>
              <p className="text-[10px] text-[#9a4c73]">User: {log.userId} • {formatDate(log.timestamp)}</p>
            </div>
          ))}
          {data.recentAuditLogs.length === 0 && <p className="text-sm text-[#9a4c73]">Chưa có hành vi nào</p>}
        </div>
      </div>
    </div>
  </div>
);

// =============================================
// Stat Card
// =============================================
const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string; color: string }> = ({
  icon: Icon,
  label,
  value,
  color,
}) => (
  <div className="bg-white p-5 rounded-3xl border border-[#f3e7ed]">
    <p className="text-[10px] text-[#9a4c73] font-bold uppercase tracking-widest mb-2">{label}</p>
    <div className="flex items-center gap-3">
      <Icon className={color} size={22} />
      <span className="text-2xl font-black">{value}</span>
    </div>
  </div>
);

// =============================================
// Application Logs Tab
// =============================================
const AppLogsTab: React.FC<{
  data: PaginatedResult<ApplicationLogDto> | null;
  level: string;
  setLevel: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  onSearch: () => void;
  page: number;
  setPage: (p: number) => void;
}> = ({ data, level, setLevel, search, setSearch, onSearch, page, setPage }) => (
  <div className="animate-fadeIn space-y-4">
    {/* Filters */}
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-[#f3e7ed] p-4">
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="border border-[#f3e7ed] rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Tất cả Level</option>
        <option value="Info">Info</option>
        <option value="Warning">Warning</option>
        <option value="Error">Error</option>
        <option value="Critical">Critical</option>
        <option value="Debug">Debug</option>
      </select>
      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a4c73]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Tìm kiếm message..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-[#f3e7ed] rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
          />
        </div>
        <button onClick={onSearch} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90">
          Tìm
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="bg-white rounded-2xl border border-[#f3e7ed] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f5f7]">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Level</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Message</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Source</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">User</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e7ed]">
            {data?.items.map((log) => (
              <tr key={log.id} className="hover:bg-[#fcf8fa] transition-colors">
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${levelColor[log.level] || 'bg-gray-100'}`}>
                    {log.level}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs truncate" title={log.message}>{log.message}</td>
                <td className="px-4 py-3 text-xs font-mono text-[#9a4c73]">{log.source}</td>
                <td className="px-4 py-3 text-xs text-[#9a4c73]">{log.userId || '—'}</td>
                <td className="px-4 py-3 text-xs text-[#9a4c73] whitespace-nowrap">{formatDate(log.timestamp)}</td>
              </tr>
            ))}
            {(!data || data.items.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#9a4c73]">Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {data && <Pagination page={page} totalPages={data.totalPages} totalCount={data.totalCount} setPage={setPage} />}
  </div>
);

// =============================================
// Audit Logs Tab
// =============================================
const AuditLogsTab: React.FC<{
  data: PaginatedResult<AuditLogDto> | null;
  action: string;
  setAction: (v: string) => void;
  entity: string;
  setEntity: (v: string) => void;
  onSearch: () => void;
  page: number;
  setPage: (p: number) => void;
}> = ({ data, action, setAction, entity, setEntity, onSearch, page, setPage }) => (
  <div className="animate-fadeIn space-y-4">
    {/* Filters */}
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-[#f3e7ed] p-4">
      <select
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="border border-[#f3e7ed] rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Tất cả Action</option>
        <option value="Login">Login</option>
        <option value="Logout">Logout</option>
        <option value="Register">Register</option>
        <option value="Create">Create</option>
        <option value="Update">Update</option>
        <option value="Delete">Delete</option>
      </select>
      <select
        value={entity}
        onChange={(e) => setEntity(e.target.value)}
        className="border border-[#f3e7ed] rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Tất cả Entity</option>
        <option value="User">User</option>
        <option value="Deck">Deck</option>
        <option value="Card">Card</option>
        <option value="MatchingGame">MatchingGame</option>
        <option value="RewritingGame">RewritingGame</option>
      </select>
      <button onClick={onSearch} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90">
        Lọc
      </button>
    </div>

    {/* Table */}
    <div className="bg-white rounded-2xl border border-[#f3e7ed] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f5f7]">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Action</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Entity</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Entity ID</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">User ID</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Kết quả</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">IP</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e7ed]">
            {data?.items.map((log) => (
              <tr key={log.id} className="hover:bg-[#fcf8fa] transition-colors">
                <td className="px-4 py-3 font-bold text-xs">{log.action}</td>
                <td className="px-4 py-3 text-xs">{log.entityType}</td>
                <td className="px-4 py-3 text-xs font-mono text-[#9a4c73]">{log.entityId || '—'}</td>
                <td className="px-4 py-3 text-xs font-mono text-[#9a4c73] max-w-[120px] truncate">{log.userId}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.result === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {log.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#9a4c73]">{log.ipAddress || '—'}</td>
                <td className="px-4 py-3 text-xs text-[#9a4c73] whitespace-nowrap">{formatDate(log.timestamp)}</td>
              </tr>
            ))}
            {(!data || data.items.length === 0) && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#9a4c73]">Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {data && <Pagination page={page} totalPages={data.totalPages} totalCount={data.totalCount} setPage={setPage} />}
  </div>
);

// =============================================
// Request Logs Tab
// =============================================
const RequestLogsTab: React.FC<{
  data: PaginatedResult<ApiRequestLogDto> | null;
  method: string;
  setMethod: (v: string) => void;
  minDuration: string;
  setMinDuration: (v: string) => void;
  onSearch: () => void;
  page: number;
  setPage: (p: number) => void;
}> = ({ data, method, setMethod, minDuration, setMinDuration, onSearch, page, setPage }) => (
  <div className="animate-fadeIn space-y-4">
    {/* Filters */}
    <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-[#f3e7ed] p-4">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="border border-[#f3e7ed] rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Tất cả Method</option>
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>
      <input
        value={minDuration}
        onChange={(e) => setMinDuration(e.target.value)}
        placeholder="Min duration (ms)"
        type="number"
        className="border border-[#f3e7ed] rounded-lg px-3 py-2 text-sm w-40"
      />
      <button onClick={onSearch} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:opacity-90">
        Lọc
      </button>
    </div>

    {/* Table */}
    <div className="bg-white rounded-2xl border border-[#f3e7ed] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f5f7]">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Method</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Path</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Duration</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">User</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">IP</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-[#9a4c73] uppercase">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3e7ed]">
            {data?.items.map((log) => (
              <tr key={log.id} className="hover:bg-[#fcf8fa] transition-colors">
                <td className="px-4 py-3">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${methodColor[log.method] || 'bg-gray-100'}`}>
                    {log.method}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono max-w-[200px] truncate" title={log.path}>{log.path}</td>
                <td className={`px-4 py-3 text-xs font-bold ${statusColor(log.statusCode)}`}>{log.statusCode}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={log.durationMs > 1000 ? 'text-red-500 font-bold' : log.durationMs > 500 ? 'text-yellow-600' : 'text-green-600'}>
                    {log.durationMs}ms
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-[#9a4c73] max-w-[100px] truncate">{log.userId || '—'}</td>
                <td className="px-4 py-3 text-xs text-[#9a4c73]">{log.ipAddress || '—'}</td>
                <td className="px-4 py-3 text-xs text-[#9a4c73] whitespace-nowrap">{formatDate(log.timestamp)}</td>
              </tr>
            ))}
            {(!data || data.items.length === 0) && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-[#9a4c73]">Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {data && <Pagination page={page} totalPages={data.totalPages} totalCount={data.totalCount} setPage={setPage} />}
  </div>
);

// =============================================
// Pagination
// =============================================
const Pagination: React.FC<{
  page: number;
  totalPages: number;
  totalCount: number;
  setPage: (p: number) => void;
}> = ({ page, totalPages, totalCount, setPage }) => (
  <div className="flex items-center justify-between bg-white rounded-2xl border border-[#f3e7ed] px-4 py-3">
    <span className="text-xs text-[#9a4c73]">
      Tổng: <span className="font-bold">{totalCount.toLocaleString()}</span> bản ghi • Trang {page}/{totalPages}
    </span>
    <div className="flex items-center gap-2">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-[#f3e7ed] hover:bg-[#f3e7ed] disabled:opacity-30 transition-all"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-[#f3e7ed] hover:bg-[#f3e7ed] disabled:opacity-30 transition-all"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  </div>
);

export default AdminSystemStatus;
