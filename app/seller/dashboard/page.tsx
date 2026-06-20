'use client';

import { useState } from 'react';
import StatsCards from '@/components/seller/StatsCards';
import RevenueChart from '@/components/seller/RevenueChart';
import OrdersTable from '@/components/seller/OrdersTable';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import {
  Plus, ArrowDownToLine, BarChart3, ChevronRight,
} from 'lucide-react';

const quickActions = [
  {
    icon: Plus,
    label: 'Create New Listing',
    desc: 'Add a product to your store',
    color: 'var(--primary)',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    icon: ArrowDownToLine,
    label: 'Request Payout',
    desc: 'Withdraw to your wallet',
    color: 'var(--success)',
    bg: 'rgba(52,211,153,0.08)',
  },
  {
    icon: BarChart3,
    label: 'View Analytics',
    desc: 'Detailed performance report',
    color: 'var(--accent)',
    bg: 'rgba(34,211,238,0.08)',
  },
];

const healthMetrics = [
  { label: 'Sales Velocity', value: 90, status: 'Excellent', color: 'var(--success)', cssClass: 'success' },
  { label: 'Response Time', value: 75, status: 'Good', color: 'var(--warning)', cssClass: 'warning' },
  { label: 'Positive Feedback', value: 97, status: 'Excellent', color: 'var(--success)', cssClass: 'success' },
  { label: 'Return Rate', value: 8, status: 'Low', color: 'var(--accent)', cssClass: '' },
];

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {greeting}, <span className="gradient-text">NexusStore</span>
            </h1>
            <p className="text-[var(--text-dim)] text-sm mt-1.5">
              {dateStr} — Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <StatsCards />
          </div>

          {/* Chart + Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6 mb-8">
            <div className="xl:col-span-2">
              <RevenueChart />
            </div>

            <div className="card p-6 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-5">Quick Actions</h3>
              <div className="space-y-2.5 flex-1">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className="w-full text-left px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--primary)] hover:bg-[var(--surface-3)] transition-all flex items-center gap-4 group"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: action.bg }}
                    >
                      <action.icon className="w-4 h-4" style={{ color: action.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{action.label}</div>
                      <div className="text-xs text-[var(--text-faint)] mt-0.5">{action.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-faint)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>

              {/* Store Health */}
              <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <h4 className="text-xs font-bold text-[var(--text-faint)] tracking-[0.06em] uppercase mb-4">
                  Store Health
                </h4>
                <div className="space-y-3.5">
                  {healthMetrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                          {m.label}
                        </span>
                        <span
                          className="text-[0.68rem] font-bold"
                          style={{ color: m.color }}
                        >
                          {m.status}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${m.cssClass}`}
                          style={{ width: `${m.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Orders */}
          <OrdersTable />
        </main>
      </div>
    </div>
  );
}
