'use client';

import { useState } from 'react';
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

export default function OrdersTable() {
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const { data, error, isLoading, mutate } = useSWR(
    `/api/seller/orders?status=${status}&page=${page}&sort=${sortKey}&dir=${sortDir}`,
    fetcher
  );

  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  return (
    <div className="card">
      {/* header */}
      <div className="p-5 flex justify-between">
        <div>
          <h3 className="text-white font-bold">Orders</h3>
          <p className="text-xs text-gray-400">{total} total</p>
        </div>

        <div className="flex gap-2">
          {['all', 'pending', 'shipped', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={status === s ? 'text-white' : 'text-gray-500'}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* body */}
      <div className="p-4">
        {error ? (
          <button onClick={() => mutate()}>Retry</button>
        ) : isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <table className="w-full text-sm text-white">
            <thead>
              <tr>
                <th>Order</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.status}</td>
                  <td>{o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
