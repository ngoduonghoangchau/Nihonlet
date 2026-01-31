import React from 'react';
import Header from '../components/Header';
import { Timer, Lock } from 'lucide-react';

const Pricing: React.FC = () => {
  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display text-[#1b0d14]">
      <Header />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT */}
          <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2 text-primary text-sm font-medium mb-1">
                <Lock size={16} />
                Secure Checkout with PayOS
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Payment Details
              </h1>

              <p className="text-[#9a4c73] mt-2">
                Complete your purchase to unlock{' '}
                <span className="font-semibold text-primary">
                  Premium Features
                </span>{' '}
                instantly.
              </p>
            </div>

            {/* PAYMENT METHOD */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>

              <label className="flex items-center gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                <input
                  type="radio"
                  defaultChecked
                  className="sr-only"
                />

                <div
                  className="w-20 h-12 rounded-lg bg-center bg-contain bg-no-repeat border bg-white"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCek5MgK7Mh4jQdC8iKX5P1B3jWbXuuapHDDK4dCuhCQbc79m-bNiLk3DpOpJlaPCMZbj9eSoqkvweVs5QOA4Qp5dF1BlKzyXTbZeXSRe7zWuyus3eZjljdV9qmEm8efThi6ohlm_b-J_t7DuxJh5fvy025aEHUVHwvbXMSqdR69I2_JCE41rpC0YDlA2nwE6HTILNv6sy4BKJGib0Af5fG8ng2npRD75kB9iTlKBn6Kfh0FpyrhNwTW_gDXlsGO5xZt60M96STSg")',
                  }}
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Pay with PayOS</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary text-white font-bold uppercase">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-[#9a4c73]">
                    Instant activation via QR Code or Bank App
                  </p>
                </div>
              </label>
            </div>

            {/* QR */}
            <div className="rounded-2xl border border-primary/20 bg-white shadow-sm p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="bg-white p-3 rounded-xl border shadow-inner">
                    <div
                      className="size-48 rounded-lg bg-center bg-cover"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvvAsfwHo-eTFmbx8CvOuStCtmM_-m-uStuinaHX2cBUH_TJAvz9zggseMVVg-Zh3uZd-OGZOVLcxwEeJE-UwRV1Wn5DHraG_eIwWOSc4GjkBGc4UB5p6WAjET610aBSCiAAyrwoHProZmsGnXlW2vaiIYQe7G-3pKavXb5U70z3IF-YzfF3ZTwsqEKzZaoEnOUy3gp_4tC5lQYmNIfZryd93UYXDDw8UC-JJbB3enjB6Heih3GW4RO25jV_6LQRtEz8MBJ4mCvg")',
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                    <Timer size={16} className="animate-pulse" />
                    <span>Expires in 14:59</span>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-2">Scan to Pay</h3>
                  <ol className="list-decimal list-inside text-sm space-y-1 bg-[#f8f6f7] p-4 rounded-lg border">
                    <li>Scan the QR code.</li>
                    <li>Verify amount <strong>29.000 ₫</strong>.</li>
                    <li>Complete the transfer.</li>
                  </ol>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl bg-white shadow-lg border border-[#f3e7ed] p-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>

              <div className="flex justify-between items-end mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-black text-2xl text-primary">
                  29.000 ₫
                </span>
              </div>

              <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
                I have completed the transfer
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Pricing;