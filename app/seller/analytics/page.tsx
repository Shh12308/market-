'use client';

import { useState } from 'react';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import RevenueChart from '@/components/seller/RevenueChart';
import {
  TrendingUp,
  Users,
  Eye,
  ShoppingBag,
  DollarSign,
  Package,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Store <span className="gradient-text">Analytics</span>
            </h1>

            <p className="text-[var(--text-dim)] text-sm mt-1.5">
              Monitor sales performance, customer engagement, and traffic trends.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-5 h-5 text-[var(--success)]" />
                <span className="text-xs text-[var(--success)] font-semibold">
                  +12%
                </span>
              </div>

              <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider">
                Revenue
              </p>

              <p className="text-2xl font-bold text-white mt-1">
                $24,850
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <ShoppingBag className="w-5 h-5 text-[var(--primary)]" />
                <span className="text-xs text-[var(--success)] font-semibold">
                  +8%
                </span>
              </div>

              <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider">
                Orders
              </p>

              <p className="text-2xl font-bold text-white mt-1">
                1,245
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-5 h-5 text-[var(--accent)]" />
                <span className="text-xs text-[var(--success)] font-semibold">
                  +18%
                </span>
              </div>

              <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider">
                Customers
              </p>

              <p className="text-2xl font-bold text-white mt-1">
                842
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <Eye className="w-5 h-5 text-[var(--warning)]" />
                <span className="text-xs text-[var(--success)] font-semibold">
                  +22%
                </span>
              </div>

              <p className="text-xs text-[var(--text-dim)] uppercase tracking-wider">
                Views
              </p>

              <p className="text-2xl font-bold text-white mt-1">
                48.2K
              </p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="mb-8">
            <RevenueChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {/* Top Products */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                Top Selling Products
              </h3>

              <div className="space-y-4">
                {[
                  {
                    name: 'Apple iPhone 15 Pro',
                    sales: 124,
                    revenue: '$12,400',
                  },
                  {
                    name: 'Sony WH-1000XM5',
                    sales: 97,
                    revenue: '$8,730',
                  },
                  {
                    name: 'MacBook Air M3',
                    sales: 64,
                    revenue: '$7,680',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                        #{i + 1}
                      </div>

                      <div>
                        <p className="text-sm text-white font-medium">
                          {item.name}
                        </p>

                        <p className="text-xs text-[var(--text-muted)]">
                          {item.sales} sales
                        </p>
                      </div>
                    </div>

                    <span className="text-sm text-[var(--success)] font-semibold">
                      {item.revenue}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--accent)]" />
                Traffic Sources
              </h3>

              <div className="space-y-4">
                {[
                  { source: 'Search Engines', percent: 42 },
                  { source: 'Direct Traffic', percent: 28 },
                  { source: 'Social Media', percent: 18 },
                  { source: 'Email Campaigns', percent: 12 },
                ].map((item) => (
                  <div key={item.source}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[var(--text-secondary)]">
                        {item.source}
                      </span>

                      <span className="text-[var(--text-dim)] font-medium">
                        {item.percent}%
                      </span>
                    </div>

                    <div className="h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--primary)]"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Metrics */}
            <div className="card p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--success)]" />
                Customer Insights
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-white">
                    68%
                  </p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">
                    Returning Buyers
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-white">
                    $89
                  </p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">
                    Avg Order Value
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-white">
                    126K
                  </p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">
                    Product Views
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-white">
                    4.8%
                  </p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">
                    Conversion Rate
                  </p>
                </div>
              </div>
            </div>

            {/* Inventory Insights */}
            <div className="card p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-[var(--warning)]" />
                Inventory Overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                  <p className="text-sm text-[var(--text-muted)]">
                    Active Listings
                  </p>

                  <p className="text-3xl font-bold text-white mt-2">
                    247
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                  <p className="text-sm text-[var(--text-muted)]">
                    Low Stock
                  </p>

                  <p className="text-3xl font-bold text-[var(--warning)] mt-2">
                    18
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                  <p className="text-sm text-[var(--text-muted)]">
                    Out of Stock
                  </p>

                  <p className="text-3xl font-bold text-[var(--danger)] mt-2">
                    6
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
