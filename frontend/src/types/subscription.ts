// ===== Subscription Request DTOs =====

export interface CreatePaymentRequest {
  planId: number;
}

export interface WebhookPayload {
  orderCode: string;
  status: string;
}

// ===== Subscription Response DTOs =====

export interface PaymentLinkDto {
  transactionId: number;
  orderCode: string;
  paymentUrl: string;
  amount: number;
}

export interface SubscriptionStatusDto {
  currentPlan: string;
  isPremium: boolean;
  startDate?: string;
  endDate?: string;
  status: string;
  daysRemaining?: number;
}

export interface TransactionDto {
  transId: number;
  planName: string;
  orderCode?: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paidAt?: string;
  createdAt: string;
}

export interface PendingPaymentDto {
  transactionId: number;
  orderCode: string;
  paymentUrl: string;
  amount: number;
  createdAt: string;
  remainingSeconds: number;
}
