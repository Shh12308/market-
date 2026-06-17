'use client';

import { ArrowUpRight, CheckCircle, Clock, XCircle } from 'lucide-react';

const payouts = [
  { id: '#PAY-8821', date: 'Oct 24, 2023', amount: '$4,500.00', method: 'ETH (ERC-20)', status: 'Completed', hash: '0x3a...9b2' },
  { id: '#PAY-8820', date: 'Oct 17, 2023', amount: '$1,250.00', method: 'USDC (Solana)', status: 'Completed', hash: '5xK...2a1' },
  { id: '#PAY-8819', date: 'Oct 10, 2023', amount: '$3,100.00', method: 'ETH (ERC-20)', status: 'Processing', hash: '-' },
  { id: '#PAY-8818', date: 'Oct 03, 2023', amount: '$890.00', method: 'Bank Transfer', status: 'Failed', hash: '-' },
];

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'Completed': return <CheckCircle className="w-4 h-4 text-[var(--success)]" />;
    case 'Processing': return <Clock className="w-4 h-4 text-[var(--warning)]" />;
    case 'Failed': return <XCircle className="w-4 h-4 text-[var(--danger)]" />;
    default: return null;
  }
};

export default function PayoutTable() {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-[var(--border)]">
        <h3 className="text-lg font-bold text-white">Payout History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-muted)]">
          <thead className="bg-[var(--surface-2)] text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{payout.id}</td>
                <td className="px-6 py-4">{payout.date}</td>
                <td className="px-6 py-4 text-white font-mono">{payout.amount}</td>
                <td className="px-6 py-4">{payout.method}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payout.status)}
                    <span className={payout.status === 'Completed' ? 'text-[var(--success)]' : payout.status === 'Failed' ? 'text-[var(--danger)]' : 'text-[var(--warning)]'}>
                      {payout.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {payout.hash !== '-' ? (
                    <a href="#" className="flex items-center gap-1 text-[var(--primary)] hover:underline">
                      {payout.hash} <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[var(--text-dim)]">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
