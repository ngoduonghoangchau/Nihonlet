import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import * as subscriptionService from "../services/subscriptionService";
import type { SubscriptionStatusDto, TransactionDto } from "../types/subscription";
import {
  Crown,
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  AlertTriangle,
  ArrowRight,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshToken } = useAuth();
  const [subStatus, setSubStatus] = useState<SubscriptionStatusDto | null>(null);
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statusRes, historyRes] = await Promise.all([
          subscriptionService.getSubscriptionStatus(),
          subscriptionService.getPaymentHistory(),
        ]);
        if (statusRes.success && statusRes.data) setSubStatus(statusRes.data);
        if (historyRes.success && historyRes.data) setTransactions(historyRes.data);
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const response = await subscriptionService.cancelSubscription();
      if (response.success) {
        await refreshToken();
        // Refresh subscription data
        const statusRes = await subscriptionService.getSubscriptionStatus();
        if (statusRes.success && statusRes.data) setSubStatus(statusRes.data);
      }
    } catch {
      // Handle silently
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " \u20ab";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
            <CheckCircle size={12} /> Success
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
            <Clock size={12} /> Pending
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <XCircle size={12} /> Failed
          </span>
        );
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            <AlertCircle size={12} /> Expired
          </span>
        );
      default:
        return <span className="text-xs text-gray-500">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const isPremium = subStatus?.isPremium ?? false;

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <h1 className="text-3xl font-black tracking-tight">Subscription Management</h1>

        {/* Current Plan Status */}
        <div
          className={`rounded-2xl border p-6 ${
            isPremium ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200" : "bg-white border-[#f3e7ed]"
          }`}
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  isPremium ? "bg-gradient-to-br from-amber-400 to-yellow-500" : "bg-gray-100"
                }`}
              >
                <Crown size={28} className={isPremium ? "text-white" : "text-gray-400"} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{subStatus?.currentPlan ?? "Free"} Plan</h2>
                <p className="text-sm text-[#9a4c73]">
                  {isPremium ? `Active - ${subStatus?.daysRemaining ?? 0} days remaining` : "Limited features"}
                </p>
              </div>
            </div>

            {isPremium ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-bold">
                <CheckCircle size={16} />
                Active
              </span>
            ) : (
              <button
                onClick={() => navigate("/premium-checkout")}
                className="bg-primary hover:bg-pink-600 text-white font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2"
              >
                Upgrade Now <ArrowRight size={18} />
              </button>
            )}
          </div>

          {isPremium && subStatus && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                <Calendar size={18} className="text-amber-600" />
                <div>
                  <p className="text-xs text-[#9a4c73]">Start Date</p>
                  <p className="text-sm font-bold">{formatDate(subStatus.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                <Calendar size={18} className="text-amber-600" />
                <div>
                  <p className="text-xs text-[#9a4c73]">End Date</p>
                  <p className="text-sm font-bold">{formatDate(subStatus.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                <Clock size={18} className="text-amber-600" />
                <div>
                  <p className="text-xs text-[#9a4c73]">Remaining</p>
                  <p className="text-sm font-bold">{subStatus.daysRemaining ?? 0} days</p>
                </div>
              </div>
            </div>
          )}

          {isPremium && (
            <div className="mt-6 pt-4 border-t border-amber-200/50">
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white border border-[#f3e7ed] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#f3e7ed] flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            <h3 className="text-xl font-bold">Payment History</h3>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-[#9a4c73]">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-[#f3e7ed]">
                    <th className="py-3 px-6 text-left text-xs font-semibold text-[#9a4c73] uppercase">Date</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-[#9a4c73] uppercase">Plan</th>
                    <th className="py-3 px-6 text-right text-xs font-semibold text-[#9a4c73] uppercase">Amount</th>
                    <th className="py-3 px-6 text-center text-xs font-semibold text-[#9a4c73] uppercase">Status</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-[#9a4c73] uppercase">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3e7ed]">
                  {transactions.map((tx) => (
                    <tr key={tx.transId} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6 text-sm">{formatDate(tx.createdAt)}</td>
                      <td className="py-3 px-6 text-sm font-medium">{tx.planName}</td>
                      <td className="py-3 px-6 text-sm text-right font-bold">{formatCurrency(tx.amount)}</td>
                      <td className="py-3 px-6 text-center">{getStatusBadge(tx.status)}</td>
                      <td className="py-3 px-6 text-sm text-[#9a4c73]">{tx.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold">Cancel Subscription?</h3>
            </div>
            <p className="text-sm text-[#9a4c73] mb-6">
              Your premium features will be removed immediately. You will revert to the Free plan with a limit of 10
              flashcard decks.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg border border-[#f3e7ed] text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
