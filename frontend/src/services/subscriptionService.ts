import api from "../api/axios";
import type { ApiResponse } from "../types/auth";
import type {
  CreatePaymentRequest,
  PaymentLinkDto,
  SubscriptionStatusDto,
  TransactionDto,
  PendingPaymentDto,
} from "../types/subscription";

// ===== Tạo payment session =====
export const createPayment = async (request: CreatePaymentRequest): Promise<ApiResponse<PaymentLinkDto>> => {
  const response = await api.post<ApiResponse<PaymentLinkDto>>("/subscription/create-payment", request);
  return response.data;
};

// ===== Lấy trạng thái subscription =====
export const getSubscriptionStatus = async (): Promise<ApiResponse<SubscriptionStatusDto>> => {
  const response = await api.get<ApiResponse<SubscriptionStatusDto>>("/subscription/status");
  return response.data;
};

// ===== Lấy lịch sử thanh toán =====
export const getPaymentHistory = async (): Promise<ApiResponse<TransactionDto[]>> => {
  const response = await api.get<ApiResponse<TransactionDto[]>>("/subscription/payment-history");
  return response.data;
};

// ===== Huỷ subscription =====
export const cancelSubscription = async (): Promise<ApiResponse<boolean>> => {
  const response = await api.post<ApiResponse<boolean>>("/subscription/cancel");
  return response.data;
};

// ===== Polling trạng thái thanh toán =====
export const getPaymentStatus = async (orderCode: string): Promise<ApiResponse<string>> => {
  const response = await api.get<ApiResponse<string>>(`/subscription/payment-status/${orderCode}`);
  return response.data;
};

// ===== Xác nhận thanh toán thủ công =====
export const confirmPayment = async (orderCode: string): Promise<ApiResponse<boolean>> => {
  const response = await api.post<ApiResponse<boolean>>("/subscription/confirm-payment", {
    orderCode,
    status: "Success",
  });
  return response.data;
};

// ===== Lấy thông tin pending payment để restore session =====
export const getPendingPayment = async (): Promise<ApiResponse<PendingPaymentDto | null>> => {
  const response = await api.get<ApiResponse<PendingPaymentDto | null>>("/subscription/pending-payment");
  return response.data;
};
