import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import RevenueChart from '@/components/seller/RevenueChart';
import { TrendingUp, Users, ShoppingCart, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
           <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-[var(--text-muted)]">Deep dive into your store performance metrics.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <RevenueChart />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performing Products */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--primary)]" /> Top Performers
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[var(--surface-3)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">#{i}</div>
                      <div>
                        <p className="text-sm text-white font-medium">Crypto Product {i}</p>
                        <p className="text-xs text-[var(--text-muted)]">124 Sales</p>
                      </div>
                    </div>
                    <span className="text-sm text-[var(--success)] font-mono">+$1,240</span>
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
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white">{item.source}</span>
                      <span className="text-[var(--text-muted)]">{item.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

             {/* Customer Demographics (Mock) */}
             <div className="card p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--success)]" /> Customer Activity
              </h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                 <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                   <p className="text-2xl font-bold text-white">85%</p>
                   <p className="text-xs text-[var(--text-muted)]">Return Rate</p>
                 </div>
                 <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                   <p className="text-2xl font-bold text-white">$450</p>
                   <p className="text-xs text-[var(--text-muted)]">Avg Order Value</p>
                 </div>
                 <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                   <p className="text-2xl font-bold text-white">2.4m</p>
                   <p className="text-xs text-[var(--text-muted)]">Total Page Views</p>
                 </div>
                 <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                   <p className="text-2xl font-bold text-white">15k</p>
                   <p className="text-xs text-[var(--text-muted)]">Unique Visitors</p>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
