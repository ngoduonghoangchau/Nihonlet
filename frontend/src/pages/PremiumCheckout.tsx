import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import * as subscriptionService from "../services/subscriptionService";
import { Timer, Lock, Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import type { PaymentLinkDto, PendingPaymentDto } from "../types/subscription";

type CheckoutState = "idle" | "creating" | "awaiting_payment" | "confirming" | "success" | "failed";

const PREMIUM_PLAN_ID = 2;
const PAYMENT_TIMEOUT_SECONDS = 15 * 60; // 15 minutes
const POLL_INTERVAL_MS = 5000;

const PremiumCheckout: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshToken } = useAuth();
  const [state, setState] = useState<CheckoutState>("idle");
  const [paymentInfo, setPaymentInfo] = useState<PaymentLinkDto | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(PAYMENT_TIMEOUT_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingPending, setIsCheckingPending] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect if already premium
  useEffect(() => {
    if (user?.isPremium) {
      navigate("/subscription");
    }
  }, [user?.isPremium, navigate]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Start countdown timer
  const startTimer = useCallback((initialSeconds: number = PAYMENT_TIMEOUT_SECONDS) => {
    setTimeRemaining(initialSeconds);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (pollRef.current) clearInterval(pollRef.current);
          setState("failed");
          setError("Payment session expired. Please try again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Start polling for payment status
  const startPolling = useCallback(
    (orderCode: string) => {
      pollRef.current = setInterval(async () => {
        try {
          const response = await subscriptionService.getPaymentStatus(orderCode);
          if (response.success && response.data) {
            if (response.data === "Success") {
              if (pollRef.current) clearInterval(pollRef.current);
              if (timerRef.current) clearInterval(timerRef.current);
              await refreshToken();
              setState("success");
            } else if (response.data === "Failed" || response.data === "Expired") {
              if (pollRef.current) clearInterval(pollRef.current);
              if (timerRef.current) clearInterval(timerRef.current);
              setState("failed");
              setError("Payment was not completed.");
            }
          }
        } catch {
          // Ignore polling errors
        }
      }, POLL_INTERVAL_MS);
    },
    [refreshToken],
  );

  // Restore payment session from pending payment
  const restorePaymentSession = useCallback(
    (pendingPayment: PendingPaymentDto) => {
      // Validate remaining time
      if (pendingPayment.remainingSeconds <= 0) {
        return; // Too late, let user create new payment
      }

      // Show warning if time is running out
      if (pendingPayment.remainingSeconds < 60) {
        setError("Payment session expiring soon. Please complete quickly.");
      }

      // Convert to PaymentLinkDto format
      const paymentInfo: PaymentLinkDto = {
        transactionId: pendingPayment.transactionId,
        orderCode: pendingPayment.orderCode,
        paymentUrl: pendingPayment.paymentUrl,
        amount: pendingPayment.amount,
      };

      // Restore state
      setPaymentInfo(paymentInfo);
      setState("awaiting_payment");

      // Start timer with remaining time
      startTimer(pendingPayment.remainingSeconds);

      // Resume polling
      startPolling(pendingPayment.orderCode);
    },
    [startTimer, startPolling],
  );

  // Check for pending payment on mount to restore session
  useEffect(() => {
    const checkPendingPayment = async () => {
      if (user?.isPremium) {
        setIsCheckingPending(false);
        return;
      }

      try {
        const response = await subscriptionService.getPendingPayment();
        if (response.success && response.data) {
          // Restore session if pending payment exists
          restorePaymentSession(response.data);
        }
      } catch (error) {
        console.error("Failed to check pending payment:", error);
      } finally {
        setIsCheckingPending(false);
      }
    };

    checkPendingPayment();
  }, [user?.isPremium, restorePaymentSession]);

  // Create payment session
  const handleCreatePayment = async () => {
    if (isCheckingPending) {
      setError("Checking for existing payment session...");
      return;
    }

    setState("creating");
    setError(null);
    try {
      const response = await subscriptionService.createPayment({ planId: PREMIUM_PLAN_ID });
      if (response.success && response.data) {
        setPaymentInfo(response.data);
        setState("awaiting_payment");
        startTimer();
        startPolling(response.data.orderCode);
      } else {
        setState("failed");
        setError(response.message || "Failed to create payment session.");
      }
    } catch (err: unknown) {
      setState("failed");
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg || "Failed to create payment session.");
    }
  };

  // Manual confirm payment
  const handleConfirmPayment = async () => {
    if (!paymentInfo) return;
    setState("confirming");
    try {
      const response = await subscriptionService.confirmPayment(paymentInfo.orderCode);
      if (response.success && response.data) {
        if (pollRef.current) clearInterval(pollRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        await refreshToken();
        setState("success");
      } else {
        setState("awaiting_payment");
        setError("Payment could not be verified. Please try again or wait for confirmation.");
      }
    } catch {
      setState("awaiting_payment");
      setError("Payment verification failed. Please try again.");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#fcf8fa] min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
        {/* SUCCESS STATE */}
        {state === "success" && (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-black mb-3">Payment Successful!</h1>
            <p className="text-[#9a4c73] mb-8">Welcome to NihonLet Premium. Your account has been upgraded.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-pink-600 transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate("/subscription")}
                className="bg-white border border-[#f3e7ed] text-[#1b0d14] font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {/* FAILED STATE */}
        {state === "failed" && (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-black mb-3">Payment Failed</h1>
            <p className="text-[#9a4c73] mb-8">{error || "Something went wrong with your payment."}</p>
            <button
              onClick={() => {
                setState("idle");
                setError(null);
                setPaymentInfo(null);
              }}
              className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-pink-600 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* IDLE / CREATING / AWAITING / CONFIRMING STATES */}
        {state !== "success" && state !== "failed" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT */}
            <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
              <div>
                <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                  <Lock size={16} />
                  Secure Checkout with Bank Transfer
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Payment Details</h1>
                <p className="text-[#9a4c73] mt-2">
                  Complete your purchase to unlock <span className="font-semibold text-primary">Premium Features</span>{" "}
                  instantly.
                </p>
              </div>

              {/* PAYMENT METHOD */}
              <div>
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <label className="flex items-center gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                  <input type="radio" defaultChecked className="sr-only" />
                  <div className="w-20 h-12 rounded-lg bg-white border flex items-center justify-center text-xs font-bold text-primary">
                    Chuyển
                    <br />
                    khoản
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">Chuyển khoản ngân hàng</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary text-white font-bold uppercase">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-[#9a4c73]">Instant activation via QR Code or Bank App</p>
                  </div>
                </label>
              </div>

              {/* PAYMENT AREA */}
              {state === "idle" && (
                <div className="rounded-2xl border border-primary/20 bg-white shadow-sm p-6 md:p-8 text-center">
                  <h3 className="text-xl font-bold mb-4">Ready to Upgrade?</h3>
                  <p className="text-[#9a4c73] mb-6">
                    Click below to generate your payment session. You'll receive a QR code to scan with your banking
                    app.
                  </p>
                  <button
                    onClick={handleCreatePayment}
                    className="bg-primary hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {state === "creating" && (
                <div className="rounded-2xl border border-primary/20 bg-white shadow-sm p-6 md:p-8 flex items-center justify-center gap-3">
                  <Loader2 size={24} className="animate-spin text-primary" />
                  <span className="text-[#9a4c73] font-medium">Creating payment session...</span>
                </div>
              )}

              {(state === "awaiting_payment" || state === "confirming") && paymentInfo && (
                <div className="rounded-2xl border border-primary/20 bg-white shadow-sm p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row gap-8 items-center">
                    <div className="flex flex-col items-center gap-3 shrink-0">
                      <div className="bg-white p-3 rounded-xl border shadow-inner">
                        <div className="size-48 rounded-lg bg-gray-100 flex items-center justify-center text-center p-4">
                          <div>
                            <p className="text-xs text-gray-400 mb-2">Mock QR Code</p>
                            <p className="text-sm font-mono font-bold text-primary break-all">
                              {paymentInfo.orderCode}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                        <Timer size={16} className="animate-pulse" />
                        <span>Expires in {formatTime(timeRemaining)}</span>
                      </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-bold mb-2">Complete Your Payment</h3>
                      <ol className="list-decimal list-inside text-sm space-y-1 bg-[#f8f6f7] p-4 rounded-lg border">
                        <li>Open your banking app</li>
                        <li>
                          Verify amount: <strong>29.000 &#8363;</strong>
                        </li>
                        <li>Complete the transfer</li>
                        <li>Click the button below to confirm</li>
                      </ol>
                      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* RIGHT - Order Summary */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-2xl bg-white shadow-lg border border-[#f3e7ed] p-6">
                <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#9a4c73]">Plan</span>
                    <span className="font-bold">Premium (Monthly)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9a4c73]">Duration</span>
                    <span className="font-bold">30 days</span>
                  </div>
                  <div className="w-full h-px bg-[#f3e7ed]"></div>
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-black text-2xl text-primary">29.000 &#8363;</span>
                  </div>
                </div>

                {(state === "awaiting_payment" || state === "confirming") && (
                  <button
                    onClick={handleConfirmPayment}
                    disabled={state === "confirming"}
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {state === "confirming" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "I have completed the transfer"
                    )}
                  </button>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default PremiumCheckout;
