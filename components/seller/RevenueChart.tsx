'use client';

import { useState } from 'react';
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const periods = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' },
];

// ✅ FIX: properly type tooltip props
type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string | number;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const eth = payload[0].value;
  const usd = (eth * 3360).toFixed(2);

  return (
    <div
      style={{
        background: 'rgba(14, 14, 17, 0.95)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
        {label}
      </p>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
        {eth} ETH
      </p>
      <p style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
        ≈ ${Number(usd).toLocaleString()}
      </p>

      {payload[0]?.payload?.orders && (
        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
          {payload[0].payload.orders} orders
        </p>
      )}
    </div>
  );
}

export default function RevenueChart() {
  const [period, setPeriod] = useState('30d');

  const { data, error, isLoading } = useSWR(
    `/api/seller/revenue?period=${period}`,
    fetcher
  );

  const totalEth =
    data?.data?.reduce((sum: number, d: any) => sum + d.revenue, 0) || 0;

  const totalOrders =
    data?.data?.reduce((sum: number, d: any) => sum + (d.orders || 0), 0) || 0;

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Revenue</h3>

          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-extrabold text-white">
              {totalEth.toFixed(2)} ETH
            </span>

            <span className="text-sm text-[var(--text-dim)]">
              ≈ $
              {(
                totalEth * 3360
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>

            <span className="text-xs text-[var(--text-faint)]">
              {totalOrders} orders
            </span>
          </div>
        </div>

        <div className="tabs-pills">
          {periods.map((p) => (
            <button
              key={p.value}
              className={`tab ${period === p.value ? 'active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-[280px] dark-skeleton rounded-lg" />
      ) : error ? (
        <div className="h-[280px] flex items-center justify-center text-[var(--danger)] text-sm">
          Failed to load chart data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data.data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#334155"
              tick={{ fontSize: 11, fill: '#475569' }}
              axisLine={{ stroke: 'rgba(148,163,184,0.06)' }}
              tickLine={false}
              interval="preserveStartEnd"
            />

            <YAxis
              stroke="#334155"
              tick={{ fontSize: 11, fill: '#475569' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v} Ξ`}
              width={50}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              fill="url(#revGrad)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: '#6366f1',
                stroke: '#030304',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
