import DisputesTable from '@/components/seller/DisputesTable';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import { AlertTriangle, MessageCircle, FileText } from 'lucide-react';

export default function DisputesPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Resolution Center</h1>
            <p className="text-[var(--text-muted)]">Manage customer disputes and claims efficiently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6 border-t-4 border-t-[var(--danger)]">
               <div className="flex items-center gap-3 mb-2">
                 <AlertTriangle className="w-5 h-5 text-[var(--danger)]" />
                 <h3 className="text-sm font-semibold text-[var(--text-muted)]">Open Disputes</h3>
               </div>
               <p className="text-3xl font-bold text-white">3</p>
               <p className="text-xs text-[var(--danger)] mt-1">Action Required</p>
            </div>
            <div className="card p-6 border-t-4 border-t-[var(--warning)]">
               <div className="flex items-center gap-3 mb-2">
                 <MessageCircle className="w-5 h-5 text-[var(--warning)]" />
                 <h3 className="text-sm font-semibold text-[var(--text-muted)]">Under Review</h3>
               </div>
               <p className="text-3xl font-bold text-white">1</p>
               <p className="text-xs text-[var(--text-muted)] mt-1">Awaiting Admin</p>
            </div>
            <div className="card p-6 border-t-4 border-t-[var(--success)]">
               <div className="flex items-center gap-3 mb-2">
                 <FileText className="w-5 h-5 text-[var(--success)]" />
                 <h3 className="text-sm font-semibold text-[var(--text-muted)]">Resolved (30d)</h3>
               </div>
               <p className="text-3xl font-bold text-white">12</p>
               <p className="text-xs text-[var(--success)] mt-1">Closed Successfully</p>
            </div>
          </div>

          <DisputesTable />
        </main>
      </div>
    </div>
  );
}
