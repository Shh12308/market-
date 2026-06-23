"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/seller/Sidebar";
import Header from "@/components/seller/Header";
import PayoutTable from "@/components/seller/PayoutTable";

interface PayoutData {
  availableBalance: number;
  pendingBalance: number;
  nextPayoutDate: string;
  stripeConnected: boolean;
  bankName?: string;
  last4?: string;
}

export default function PayoutsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<PayoutData>({
    availableBalance: 0,
    pendingBalance: 0,
    nextPayoutDate: "",
    stripeConnected: false,
  });

  useEffect(() => {
    async function loadPayouts() {
      try {
        const res = await fetch("/api/seller/payouts");

        if (!res.ok) {
          throw new Error("Failed to load payout data");
        }

        const payoutData = await res.json();
        setData(payoutData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadPayouts();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const connectStripe = async () => {
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
      });

      const result = await res.json();

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect Stripe account.");
    }
  };

  const withdrawFunds = async () => {
    try {
      const res = await fetch("/api/seller/withdraw", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error();
      }

      alert("Withdrawal request submitted.");
    } catch {
      alert("Failed to submit withdrawal.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header onMenuToggle={toggleSidebar} />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Payouts & Earnings
            </h1>

            <p className="text-[var(--text-muted)]">
              Manage your earnings, payouts, and payment account settings.
            </p>
          </div>

          {!loading && !data.stripeConnected && (
            <div className="card p-6 mb-8 border border-yellow-500/20 bg-yellow-500/5">
              <h2 className="text-lg font-semibold text-white mb-2">
                Connect Stripe
              </h2>

              <p className="text-sm text-[var(--text-muted)] mb-4">
                Connect your Stripe account to receive payouts from your sales.
              </p>

              <button
                onClick={connectStripe}
                className="primary-btn"
              >
                Connect Stripe Account
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="card p-6 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)]">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Available Balance
              </h3>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">
                  $
                  {loading
                    ? "0.00"
                    : data.availableBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </span>
              </div>

              <button
                onClick={withdrawFunds}
                disabled={
                  !data.stripeConnected ||
                  data.availableBalance <= 0
                }
                className="w-full primary-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw Funds
              </button>

              <p className="text-xs text-[var(--text-muted)] text-center mt-3">
                Available for payout immediately.
              </p>
            </div>

            <div className="card p-6 lg:col-span-2 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Pending Balance
                  </h3>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      $
                      {loading
                        ? "0.00"
                        : data.pendingBalance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Funds awaiting settlement and release.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)]">
                    Next Payout
                  </p>

                  <p className="text-sm font-medium text-white">
                    {loading
                      ? "--"
                      : data.nextPayoutDate}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                  Payout Account
                </h4>

                {data.stripeConnected ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">
                        Status
                      </span>
                      <span className="text-green-400">
                        Connected
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">
                        Bank
                      </span>
                      <span className="text-white">
                        {data.bankName || "Connected"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)]">
                        Account
                      </span>
                      <span className="text-white">
                        **** {data.last4 || "0000"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-[var(--text-muted)]">
                    No payout account connected.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <PayoutTable />
          </div>
        </main>
      </div>
    </div>
  );
}
