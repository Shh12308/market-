'use client';

import { useState } from 'react';

import WalletManager from '@/components/seller/WalletManager';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import { ShieldCheck, ArrowUpRight, Banknote } from 'lucide-react';

export default function WalletsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Header onMenuToggle={toggleSidebar} />

        <main className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Payouts & Wallets
              </h1>
              <p className="text-[var(--text-muted)]">
                Manage your Stripe payouts, connected accounts, and earnings.
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="card p-4 mb-8 border-l-4 border-l-[var(--primary)] bg-[var(--primary)]/5 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[var(--primary)] mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm">
                Secure Marketplace Payouts
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                All payouts are processed through Stripe Connect. Funds are never
                stored directly by the platform.
              </p>
            </div>
          </div>

          {/* Wallet / Stripe Manager */}
          <WalletManager />

          {/* Payout History (replaces fake “on-chain activity”) */}
          <div className="card overflow-hidden mt-8">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">
                Recent Payout Activity
              </h3>
            </div>

            <table className="w-full text-left text-sm text-[var(--text-muted)]">
              <thead className="bg-[var(--surface-2)] text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border)]">
                <tr className="hover:bg-[var(--surface-2)]/50">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[var(--success)]" />
                    Payout
                  </td>
                  <td className="px-6 py-4">Stripe</td>
                  <td className="px-6 py-4 text-[var(--success)]">
                    + $1,250.00
                  </td>
                  <td className="px-6 py-4 text-[var(--success)]">
                    Completed
                  </td>
                  <td className="px-6 py-4">2 mins ago</td>
                </tr>

                <tr className="hover:bg-[var(--surface-2)]/50">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-[var(--primary)]" />
                    Withdrawal
                  </td>
                  <td className="px-6 py-4">Stripe</td>
                  <td className="px-6 py-4 text-[var(--warning)]">
                    - $300.00
                  </td>
                  <td className="px-6 py-4 text-[var(--warning)]">
                    Pending
                  </td>
                  <td className="px-6 py-4">1 hour ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
