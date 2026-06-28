'use client';

import OrdersTable from '@/components/buyer/OrdersTable';
import Sidebar from '@/components/buyer/Sidebar';
import Header from '@/components/buyer/Header';
import { useState } from 'react';

export default function BuyerOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            My Orders
          </h1>

          <OrdersTable />
        </main>
      </div>
    </div>
  );
}
