import PayoutTable from '@/components/seller/PayoutTable';
import WalletManager from '@/components/seller/WalletManager';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';

export default function PayoutsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Payouts & Finances</h1>
            <p className="text-[var(--text-muted)]">Manage your revenue, wallet connections, and withdrawal history.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Available Balance Card */}
            <div className="card p-6 col-span-1 bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)]">
              <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Available Balance</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">$12,450.00</span>
                <span className="text-sm text-[var(--text-muted)]">USD</span>
              </div>
              <button className="w-full primary-btn">Withdraw Funds</button>
              <p className="text-xs text-[var(--text-muted)] text-center mt-3">Funds are available for instant withdrawal.</p>
            </div>

            {/* Pending Balance */}
            <div className="card p-6 col-span-1 lg:col-span-2 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                 <div>
                   <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Pending Balance</h3>
                   <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">$3,200.50</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Held for security clearance (14 days).</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)]">Next Release</p>
                    <p className="text-sm font-medium text-white">Nov 14, 2023</p>
                 </div>
               </div>
               
               <div className="mt-6 pt-6 border-t border-[var(--border)]">
                 <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-3">Breakdown</h4>
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                     <span className="text-[var(--text-muted)]">Order #7720</span>
                     <span className="text-white">$49.99</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-[var(--text-muted)]">Order #7719</span>
                     <span className="text-white">$15.00</span>
                   </div>
                    <div className="flex justify-between text-sm">
                     <span className="text-[var(--text-muted)]">Order #7718</span>
                     <span className="text-white">$3,135.51</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <WalletManager />
          
          <div className="mt-8">
             <PayoutTable />
          </div>
        </main>
      </div>
    </div>
  );
}
