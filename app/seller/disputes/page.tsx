'use client';

import { useState } from 'react';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import { AlertTriangle, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function DisputesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Disputes & <span className="gradient-text">Resolution</span>
            </h1>
            <p className="text-[var(--text-dim)] text-sm mt-1.5">
              Manage and resolve order disputes.
            </p>
          </div>

          <div className="card p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--warning-muted)] flex items-center justify-center mb-4">
              <CheckCircle className="w-7 h-7 text-[var(--success)]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">All Clear</h3>
            <p className="text-sm text-[var(--text-dim)] max-w-sm">
              No open disputes at the moment. When a buyer opens a dispute, it will appear here for you to review and respond.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
