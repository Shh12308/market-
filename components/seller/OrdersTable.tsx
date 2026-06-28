'use client';

import { useState } from 'react';
import {
  Copy,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  ExternalLink,
} from 'lucide-react';

type Order = {
  id: string;
  txHash?: string;
  status: string;
  date?: string;
  amount?: any;
  buyer?: {
    name?: string;
  };
  item?: {
    name?: string;
  };
};

type Props = {
  orders: Order[];
  loading: boolean;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy} className="text-xs">
      {copied ? '✓' : <Copy className="w-3 h-3" />}
    </button>
  );
}

export default function OrdersTable({ orders, loading }: Props) {
  if (loading) return <div className="p-6">Loading...</div>;

  if (!orders?.length) {
    return <div className="p-6 text-sm text-gray-400">No orders</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="dark-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Item</th>
            <th>Buyer</th>
            <th>Amount</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="font-mono text-xs text-primary">
                {order.id}
                {order.txHash && (
                  <div className="flex gap-1 items-center">
                    <span className="text-[10px]">{order.txHash}</span>
                    <CopyButton text={order.txHash} />
                  </div>
                )}
              </td>

              <td>{order.item?.name ?? '-'}</td>
              <td>{order.buyer?.name ?? '-'}</td>
              <td>{order.amount?.crypto ?? '-'}</td>

              <td>
                <span className={`status-pill status-${order.status}`}>
                  {order.status}
                </span>
              </td>

              <td>
                <button>
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
