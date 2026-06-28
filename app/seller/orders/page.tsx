'use client';

import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import { useState } from 'react';

import OrdersTable from '@/components/seller/OrdersTable';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';

export default function SellerOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading } = useSWR('/api/seller/orders', fetcher);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">
            Order Management
          </h1>

          <OrdersTable
            orders={data?.orders ?? []}
            loading={isLoading}
          />
        </main>
      </div>
    </div>
  );
}
