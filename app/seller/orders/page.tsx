'use client';

import { useEffect, useState } from 'react';
import OrdersTable from '@/components/seller/OrdersTable';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import { Download, FileText } from 'lucide-react';
import { BACKEND_URL } from '../utils/api';

interface OrderStats {
  totalOrders: number;
  pendingAction: number;
  toShip: number;
  completed: number;
}

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingAction: 0,
    toShip: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/orders/stats`, {
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem('token')}`, // if needed
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch order stats');
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Order <span className="gradient-text">Management</span>
              </h1>
              <p className="text-[var(--text-dim)] text-sm mt-1.5">
                Track shipments, manage fulfillment, and handle crypto payments.
              </p>
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card p-4 hover:border-[var(--primary)] transition-colors">
              <p className="text-sm text-[var(--text-dim)]">Total Orders</p>
              <p className="text-2xl font-extrabold text-white mt-1">
                {loading ? '...' : stats.totalOrders}
              </p>
            </div>

            <div className="card p-4 hover:border-[var(--warning)] transition-colors">
              <p className="text-sm text-[var(--text-dim)]">Pending Action</p>
              <p className="text-2xl font-extrabold text-[var(--warning)] mt-1">
                {loading ? '...' : stats.pendingAction}
              </p>
            </div>

            <div className="card p-4 hover:border-[var(--primary)] transition-colors">
              <p className="text-sm text-[var(--text-dim)]">To Ship</p>
              <p className="text-2xl font-extrabold text-[var(--primary)] mt-1">
                {loading ? '...' : stats.toShip}
              </p>
            </div>

            <div className="card p-4 hover:border-[var(--success)] transition-colors">
              <p className="text-sm text-[var(--text-dim)]">Completed</p>
              <p className="text-2xl font-extrabold text-[var(--success)] mt-1">
                {loading ? '...' : stats.completed}
              </p>
            </div>
          </div>

          <OrdersTable />
        </main>
      </div>
    </div>
  );
}
