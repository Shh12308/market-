import OrdersTable from '@/components/seller/OrdersTable';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import { Download, FileText } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
              <p className="text-[var(--text-muted)]">Track shipments, manage fulfillment, and handle crypto payments.</p>
            </div>
            <div className="flex gap-3">
              <button className="secondary-btn flex items-center gap-2">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button className="secondary-btn flex items-center gap-2">
                <FileText className="w-4 h-4" /> Print Labels
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Order Status Filters */}
            <div className="card p-4 cursor-pointer hover:border-[var(--primary)] transition-colors">
              <p className="text-sm text-[var(--text-muted)]">Total Orders</p>
              <p className="text-2xl font-bold text-white mt-1">1,245</p>
            </div>
            <div className="card p-4 cursor-pointer hover:border-[var(--warning)] transition-colors">
              <p className="text-sm text-[var(--text-muted)]">Pending Action</p>
              <p className="text-2xl font-bold text-[var(--warning)] mt-1">12</p>
            </div>
            <div className="card p-4 cursor-pointer hover:border-[var(--primary)] transition-colors">
              <p className="text-sm text-[var(--text-muted)]">To Ship</p>
              <p className="text-2xl font-bold text-[var(--primary)] mt-1">45</p>
            </div>
            <div className="card p-4 cursor-pointer hover:border-[var(--success)] transition-colors">
              <p className="text-sm text-[var(--text-muted)]">Completed</p>
              <p className="text-2xl font-bold text-[var(--success)] mt-1">1,188</p>
            </div>
          </div>

          <OrdersTable />
        </main>
      </div>
    </div>
  );
}
