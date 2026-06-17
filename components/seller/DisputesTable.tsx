'use client';

import { AlertTriangle, MessageSquare } from 'lucide-react';

const disputes = [
  { id: '#DSP-001', order: '#ORD-7718', reason: 'Item not as described', status: 'Open', date: '2 days ago' },
  { id: '#DSP-002', order: '#ORD-7705', reason: 'Payment failed but received', status: 'Investigating', date: '5 days ago' },
  { id: '#DSP-003', order: '#ORD-7692', reason: 'Refund requested', status: 'Resolved', date: '1 week ago' },
];

export default function DisputesTable() {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-[var(--border)] bg-red-500/5">
        <div className="flex items-center gap-2 text-[var(--danger)]">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-lg font-bold">Active Disputes</h3>
        </div>
      </div>
      <table className="w-full text-left text-sm text-[var(--text-muted)]">
        <tbody className="divide-y divide-[var(--border)]">
          {disputes.map((dispute) => (
            <tr key={dispute.id} className="hover:bg-[var(--surface-2)] transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-white font-medium">{dispute.id}</span>
                  <span className="text-xs">{dispute.date}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-white">Order: {dispute.order}</span>
              </td>
              <td className="px-6 py-4">
                {dispute.reason}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                  dispute.status === 'Open' ? 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20' :
                  dispute.status === 'Investigating' ? 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20' :
                  'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20'
                }`}>
                  {dispute.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="flex items-center gap-2 text-[var(--primary)] hover:text-white transition-colors text-sm font-medium">
                  <MessageSquare className="w-4 h-4" /> Reply
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
