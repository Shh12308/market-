'use client';

import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import { Wallet, ShoppingBag, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const statConfigs = [
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: Wallet,
    gradient: 'from-[rgba(99,102,241,0.1)] to-[rgba(99,102,241,0.02)]',
    iconBg: 'bg-[rgba(99,102,241,0.12)]',
    iconColor: 'text-[var(--primary)]',
    borderHover: 'hover:border-[rgba(99,102,241,0.2)]',
    format: (v) => `${v.eth} ETH`,
    sub: (v) => `≈ $${v.usd.toLocaleString()}`,
  },
  {
    key: 'orders',
    label: 'Total Orders',
    icon: ShoppingBag,
    gradient: 'from-[rgba(52,211,153,0.1)] to-[rgba(52,211,153,0.02)]',
    iconBg: 'bg-[var(--success-muted)]',
    iconColor: 'text-[var(--success)]',
    borderHover: 'hover:border-[rgba(52,211,153,0.2)]',
    format: (v) => v.total.toLocaleString(),
    sub: null,
  },
  {
    key: 'activeListings',
    label: 'Active Listings',
    icon: Package,
    gradient: 'from-[rgba(34,211,238,0.1)] to-[rgba(34,211,238,0.02)]',
    iconBg: 'bg-[var(--accent-muted)]',
    iconColor: 'text-[var(--accent)]',
    borderHover: 'hover:border-[rgba(34,211,238,0.2)]',
    format: (v) => v.total.toString(),
    sub: null,
  },
  {
    key: 'conversionRate',
    label: 'Conversion Rate',
    icon: TrendingUp,
    gradient: 'from-[rgba(251,191,36,0.1)] to-[rgba(251,191,36,0.02)]',
    iconBg: 'bg-[var(--warning-muted)]',
    iconColor: 'text-[var(--warning)]',
    borderHover: 'hover:border-[rgba(251,191,36,0.2)]',
    format: (v) => `${v.value}%`,
    sub: null,
  },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl dark-skeleton" />
            <div className="w-16 h-5 dark-skeleton" />
          </div>
          <div className="w-28 h-7 dark-skeleton mb-2" />
          <div className="w-20 h-4 dark-skeleton" />
        </div>
      ))}
    </div>
  );
}

function StatsError({ error, mutate }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      <div className="col-span-full stat-card flex flex-col items-center justify-center py-10 text-center">
        <p className="text-[var(--danger)] text-sm font-medium mb-2">Failed to load stats</p>
        <p className="text-[var(--text-faint)] text-xs mb-4">{error.message}</p>
        <button
          onClick={() => mutate()}
          className="btn btn-sm btn-outline"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function StatsCards() {
  const { data, error, isLoading, mutate } = useSWR('/api/seller/stats', fetcher, {
    refreshInterval: 30000,
  });

  if (isLoading) return <StatsSkeleton />;
  if (error) return <StatsError error={error} mutate={mutate} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 stagger-children">
      {statConfigs.map((config) => {
        const value = data[config.key];
        const isPositive = value.change >= 0;

        return (
          <div
            key={config.key}
            className={`stat-card bg-gradient-to-br ${config.gradient} ${config.borderHover}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center`}
              >
                <config.icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>
              <div className={`price-change ${isPositive ? 'up' : 'down'}`}>
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(value.change)}%
              </div>
            </div>
            <div className="stat-value">{config.format(value)}</div>
            {config.sub && (
              <div className="text-xs text-[var(--text-dim)] mt-1 font-medium">
                {config.sub(value)}
              </div>
            )}
            <div className="stat-label">{config.label}</div>
          </div>
        );
      })}
    </div>
  );
}
