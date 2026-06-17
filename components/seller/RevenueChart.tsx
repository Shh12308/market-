'use client';

export default function RevenueChart() {
  // Mock data for visualization
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: Math.floor(Math.random() * 5000) + 2000,
    profit: Math.floor(Math.random() * 3000) + 1000,
  }));

  const maxVal = Math.max(...data.map(d => d.revenue));

  return (
    <div className="card p-6 col-span-1 lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
          <p className="text-sm text-[var(--text-muted)]">Monthly income vs profit</p>
        </div>
        <select className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-sm rounded-lg p-2 focus:outline-none">
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>YTD</option>
        </select>
      </div>

      {/* Simple CSS-based Bar Chart */}
      <div className="h-64 flex items-end justify-between gap-2 pt-4">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-full flex gap-1 items-end h-full justify-center rounded-t-md overflow-hidden bg-[var(--surface-2)]/50">
              {/* Revenue Bar */}
              <div 
                className="w-full bg-[var(--primary)]/80 hover:bg-[var(--primary)] transition-all duration-300 rounded-t-sm relative"
                style={{ height: `${(item.revenue / maxVal) * 100}%` }}
              >
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--surface)] border border-[var(--border)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                  ${item.revenue}
                </div>
              </div>
            </div>
            <span className="text-xs text-[var(--text-dim)] font-medium">{item.month}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>
          <span className="text-xs text-[var(--text-muted)]">Revenue</span>
        </div>
      </div>
    </div>
  );
}
