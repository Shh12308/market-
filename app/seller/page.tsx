'use client';

import { useState } from 'react';

import StatsCards from '@/components/seller/StatsCards';
import RevenueChart from '@/components/seller/RevenueChart';
import OrdersTable from '@/components/seller/OrdersTable';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';

export default function SellerDashboard() {
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
        {/* ✅ FIX HERE */}
        <Header onMenuToggle={toggleSidebar} />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-[var(--text-muted)]">
              Welcome back, here's what's happening with your store today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <StatsCards />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <RevenueChart />

            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface-3)] transition-all flex items-center justify-between group">
                  <span className="text-sm text-white">
                    Create New Listing
                  </span>
                  <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </button>

                <button className="w-full text-left px-4 py-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface-3)] transition-all flex items-center justify-between group">
                  <span className="text-sm text-white">
                    Request Payout
                  </span>
                  <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </button>

                <button className="w-full text-left px-4 py-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface-3)] transition-all flex items-center justify-between group">
                  <span className="text-sm text-white">
                    View Analytics Report
                  </span>
                  <span className="text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <h4 className="text-sm font-semibold text-[var(--text-muted)] mb-3">
                  Store Health
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white">Sales Velocity</span>
                      <span className="text-[var(--success)]">
                        Excellent
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--success)] w-[90%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white">Response Time</span>
                      <span className="text-[var(--warning)]">Good</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--warning)] w-[75%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <OrdersTable />
          </div>
        </main>
      </div>
    </div>
  );
}
