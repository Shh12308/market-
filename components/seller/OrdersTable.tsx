'use client';

import { MoreHorizontal, ExternalLink } from 'lucide-react';

const recentOrders = [
  { id: '#ORD-7721', customer: '0x4f...3a21', product: 'CryptoPunk #124', date: '2 min ago', amount: '12.5 ETH', status: 'Completed' },
  { id: '#ORD-7720', customer: 'alice.eth', product: 'Premium Membership', date: '15 min ago', amount: '$49.99', status: 'Processing' },
  { id: '#ORD-7719', customer: 'satoshi.n', product: 'Blockchain Guide PDF', date: '1 hour ago', amount: '$15.00', status: 'Completed' },
  { id: '#ORD-7718', customer: '0x9b...11c2', product: 'NFT Art Pack', date: '3 hours ago', amount: '0.8 ETH', status: 'Pending' },
  { id: '#ORD-7717', customer: 'jdoe_crypto', product: 'Consultation Call', date: '5 hours ago', amount: '$200.00', status: 'Cancelled' },
];

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Completed': return 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20';
    case 'Processing': return 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20';
    case 'Pending': return 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20';
    case 'Cancelled': return 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  }
};

export default function OrdersTable() {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Recent Orders</h3>
        <button className="text-sm text-[var(--primary)] hover:text-white transition-colors">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-muted)]">
          <thead className="bg-[var(--surface-2)] text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[var(--surface-2)]/50 transition-colors group">
                <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                <td className="px-6 py-4 font-mono text-xs">{order.customer}</td>
                <td className="px-6 py-4 text-white">{order.product}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4 font-medium text-white">{order.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 rounded-md hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
