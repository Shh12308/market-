'use client';

import { useState } from 'react';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import RevenueChart from '@/components/seller/RevenueChart';
import { TrendingUp, Users, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Advanced <span className="gradient-text">Analytics</span>
            </h1>
            <p className="text-[var(--text-dim)] text-sm mt-1.5">
              Deep dive into your store performance metrics.
            </p>
          </div>

          <div className="mb-8">
            <RevenueChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {/* Top Performing Products */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--primary)]" /> Top Performers
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
                        #{i}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">Crypto Product {i}</p>
                        <p className="text-xs text-[var(--text-muted)]">124 Sales</p>
                      </div>
                    </div>
                    <span className="text-sm text-[var(--success)] font-mono font-semibold">+$1,240</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--accent)]" /> Traffic Sources
              </h3>
              <div className="space-y-4">
                {[
                  { source: 'Direct', percent: 45, color: 'bg-[var(--primary)]' },
                  { source: 'Social Media', percent: 30, color: 'bg-[var(--accent)]' },
                  { source: 'External Links', percent: 15, color: 'bg-[var(--warning)]' },
                  { source: 'Search', percent: 10, color: 'bg-[var(--success)]' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--text-secondary)]">{item.source}</span>
                      <span className="text-[var(--text-dim)] font-medium">{item.percent}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${item.color === 'bg-[var(--success)]' ? 'success' : item.color === 'bg-[var(--warning)]' ? 'warning' : ''}`}
                        style={{
                          width: `${item.percent}%`,
                          background: item.color === 'bg-[var(--primary)]'
                            ? 'linear-gradient(90deg, var(--primary-deep), var(--primary))'
                            : item.color === 'bg-[var(--accent)]'
                            ? 'linear-gradient(90deg, var(--accent-hover), var(--accent))'
                            : item.color === 'bg-[var(--warning)]'
                            ? 'linear-gradient(90deg, var(--warning-deep), var(--warning))'
                            : 'linear-gradient(90deg, var(--success-deep), var(--success))',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Activity */}
            <div className="card p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--success)]" /> Customer Activity
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-white">85%</p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">Return Rate</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-white">$450</p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">Avg Order Value</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-white">2.4m</p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">Total Page Views</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <p className="text-2xl font-extrabold text-white">15k</p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">Unique Visitors</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
