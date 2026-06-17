'use client';

import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-[var(--primary)]',
    bg: 'bg-[var(--primary)]/10',
  },
  {
    title: 'Active Orders',
    value: '245',
    change: '+15%',
    trend: 'up',
    icon: Package,
    color: 'text-[var(--accent)]',
    bg: 'bg-[var(--accent)]/10',
  },
  {
    title: 'Product Sales',
    value: '+12,234',
    change: '+7.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-[var(--success)]',
    bg: 'bg-[var(--success)]/10',
  },
  {
    title: 'Active Now',
    value: '573',
    change: '-2.1%',
    trend: 'down',
    icon: Users,
    color: 'text-[var(--warning)]',
    bg: 'bg-[var(--warning)]/10',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className={`flex items-center text-sm font-medium ${
              stat.trend === 'up' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
            }`}>
              {stat.change}
              {stat.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 ml-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 ml-1" />
              )}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
          <p className="text-sm text-[var(--text-muted)] font-medium">{stat.title}</p>
        </div>
      ))}
    </div>
  );
}
