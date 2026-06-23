'use client';

import { ArrowUpRight, CheckCircle, Clock, XCircle } from 'lucide-react';

type Payout = {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: 'Completed' | 'Processing' | 'Failed';
  hash: string;
};

interface PayoutTableProps {
  payouts?: Payout[];
}

const getStatusIcon = (status: Payout['status']) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle className="w-4 h-4 text-[var(--success)]" />;
    case 'Processing':
      return <Clock className="w-4 h-4 text-[var(--warning)]" />;
    case 'Failed':
      return <XCircle className="w-4 h-4 text-[var(--danger)]" />;
    default:
      return null;
  }
};

export default function PayoutTable({
  payouts = [],
}: PayoutTableProps) {
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
            {payouts.length > 0 ? (
              payouts.map((payout) => (
                <tr
                  key={payout.id}
                  className="hover:bg-[var(--surface-2)]/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {payout.id}
                  </td>
                  <td className="px-6 py-4">{payout.date}</td>
                  <td className="px-6 py-4 text-white font-mono">
                    {payout.amount}
                  </td>
                  <td className="px-6 py-4">{payout.method}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payout.status)}
                      <span
                        className={
                          payout.status === 'Completed'
                            ? 'text-[var(--success)]'
                            : payout.status === 'Failed'
                            ? 'text-[var(--danger)]'
                            : 'text-[var(--warning)]'
                        }
                      >
                        {payout.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-xs">
                    {payout.hash ? (
                      <a
                        href={`/tx/${payout.hash}`}
                        className="flex items-center gap-1 text-[var(--primary)] hover:underline"
                      >
                        {payout.hash}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[var(--text-dim)]">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-[var(--text-dim)]"
                >
                  No payouts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
