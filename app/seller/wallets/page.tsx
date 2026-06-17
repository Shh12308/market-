import WalletManager from '@/components/seller/WalletManager';
import Sidebar from '@/components/seller/Sidebar';
import Header from '@/components/seller/Header';
import { ShieldCheck, Zap } from 'lucide-react';

export default function WalletsPage() {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
             <div>
              <h1 className="text-3xl font-bold text-white mb-2">Crypto Wallets</h1>
              <p className="text-[var(--text-muted)]">Connect your wallets for direct crypto payouts and NFT sales.</p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="card p-4 mb-8 border-l-4 border-l-[var(--primary)] bg-[var(--primary)]/5 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-[var(--primary)] mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm">Non-Custodial Security</h4>
              <p className="text-xs text-[var(--text-muted)] mt-1">We never store your private keys. Wallet connections are handled via Web3 providers (MetaMask, Phantom, WalletConnect) for maximum security.</p>
            </div>
          </div>

          <WalletManager />

          {/* Transaction History for Wallets */}
          <div className="card overflow-hidden mt-8">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Recent On-Chain Activity</h3>
            </div>
            <table className="w-full text-left text-sm text-[var(--text-muted)]">
              <thead className="bg-[var(--surface-2)] text-xs uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Network</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr className="hover:bg-[var(--surface-2)]/50">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--warning)]" /> Incoming
                  </td>
                  <td className="px-6 py-4">Ethereum</td>
                  <td className="px-6 py-4 text-[var(--success)]">+ 0.5 ETH</td>
                  <td className="px-6 py-4 text-[var(--success)]">Confirmed (12/12)</td>
                  <td className="px-6 py-4">2 mins ago</td>
                </tr>
                 <tr className="hover:bg-[var(--surface-2)]/50">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-[var(--primary)]" /> Withdrawal
                  </td>
                  <td className="px-6 py-4">Solana</td>
                  <td className="px-6 py-4 text-[var(--danger)]">- 150 SOL</td>
                  <td className="px-6 py-4 text-[var(--warning)]">Pending</td>
                  <td className="px-6 py-4">1 hour ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
