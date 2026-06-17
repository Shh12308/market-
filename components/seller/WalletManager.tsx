'use client';

import { Wallet, Copy, Plus, ArrowUpRight, ChevronDown } from 'lucide-react';

const wallets = [
  { network: 'Ethereum (ERC-20)', address: '0x71C...9A23', balance: '14.25 ETH', usdValue: '$45,230.50', connected: true },
  { network: 'Solana', address: 'F7xs...kL9z', balance: '450 SOL', usdValue: '$67,500.00', connected: true },
  { network: 'Bitcoin', address: 'bc1qa...kL02', balance: '0.5 BTC', usdValue: '$21,400.00', connected: false },
];

export default function WalletManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Connected Wallets</h3>
        <button className="secondary-btn flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Connect New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet, i) => (
          <div key={i} className="card p-6 flex flex-col justify-between h-40 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--primary)]/20 rounded-full blur-3xl group-hover:bg-[var(--primary)]/30 transition-all"></div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[var(--text-muted)]" />
                </div>
                <div>
                  <p className="font-semibold text-white">{wallet.network}</p>
                  <div className="flex items-center gap-1.5 cursor-pointer group/address">
                    <p className="text-xs font-mono text-[var(--text-muted)]">{wallet.address}</p>
                    <Copy className="w-3 h-3 text-[var(--text-dim)] opacity-0 group-hover/address:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
              {wallet.connected && (
                <div className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]"></div>
              )}
            </div>

            <div className="relative z-10 mt-4">
              <p className="text-2xl font-bold text-white">{wallet.balance}</p>
              <p className="text-xs text-[var(--text-muted)]">≈ {wallet.usdValue}</p>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-50"></div>
          </div>
        ))}
      </div>
      
      {/* Payout Method Selection */}
      <div className="card p-6">
        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider text-[var(--text-muted)]">Default Payout Method</h4>
        <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--primary)]/10 rounded-lg text-[var(--primary)]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-medium">Ethereum (ERC-20)</p>
              <p className="text-xs text-[var(--text-muted)]">0x71C...9A23</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white">
            Change <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
