import ProductsTable from '@/components/seller/ProductsTable';
import DigitalProducts from '@/components/seller/DigitalProducts';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import { Filter, SortAsc } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
              <p className="text-[var(--text-muted)]">Manage your inventory and digital assets.</p>
            </div>
            <div className="flex gap-3">
              <button className="secondary-btn flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="primary-btn">
                + Add Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <ProductsTable />
            </div>
            <div className="space-y-8">
              <DigitalProducts />
              {/* Promo Card */}
              <div className="card p-6 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)] border border-[var(--border)]">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Boost Your Sales</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">Promote your products to appear at the top of search results for 24 hours.</p>
                <button className="w-full secondary-btn text-sm">Start Promotion</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
