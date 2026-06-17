'use client';

// A specific component for handling digital goods (common in crypto markets)
const products = [
  { id: 1, title: "Phantom Wallet User Guide", type: "PDF", downloads: 1205, size: "2.4 MB" },
  { id: 2, title: "3D Abstract Pack Vol. 2", type: "ZIP (BLEND)", downloads: 450, size: "145 MB" },
  { id: 3, title: "Smart Contract Template", type: "SOL", downloads: 89, size: "12 KB" },
];

export default function DigitalProducts() {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold text-white mb-6">Digital Assets</h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface-3)] flex items-center justify-center text-[var(--text-muted)] font-bold border border-[var(--border)]">
                {product.type.split(' ')[0]}
              </div>
              <div>
                <h4 className="text-white font-medium">{product.title}</h4>
                <p className="text-xs text-[var(--text-muted)]">{product.type} • {product.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-[var(--text-muted)]">Total Downloads</p>
                <p className="text-white font-mono font-medium">{product.downloads}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-[var(--surface-3)] rounded-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
