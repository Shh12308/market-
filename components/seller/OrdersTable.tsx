'use client';

import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import {
  ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight,
  Copy, Eye, ExternalLink, AlertCircle,
} from 'lucide-react';

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Processing', value: 'shipped' },
  { label: 'Pending', value: 'pending' },
  { label: 'Escrow', value: 'escrow' },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center w-4 h-4 text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
      title="Copy hash"
    >
      {copied ? (
        <span className="text-[var(--success)] text-[0.6rem] font-bold">✓</span>
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

function ActionsDropdown({ orderId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:bg-[var(--surface-3)] transition-all"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="dropdown-menu right-0 w-48">
          <button className="dropdown-item">
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button className="dropdown-item">
            <ExternalLink className="w-4 h-4" />
            View on Chain
          </button>
          <div className="dropdown-divider" />
          <button className="dropdown-item danger">Issue Refund</button>
        </div>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-20 h-4 dark-skeleton" />
          <div className="flex-1 h-4 dark-skeleton" />
          <div className="w-24 h-4 dark-skeleton hidden sm:block" />
          <div className="w-20 h-4 dark-skeleton" />
          <div className="w-16 h-5 dark-skeleton" />
          <div className="w-16 h-4 dark-skeleton hidden md:block" />
          <div className="w-8 h-4 dark-skeleton" />
        </div>
      ))}
    </div>
  );
}

export default function OrdersTable() {
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const { data, error, isLoading, mutate } = useSWR(
    `/api/seller/orders?status=${status}&page=${page}&sort=${sortKey}&dir=${sortDir}`,
    fetcher,
    { keepPreviousData: true }
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="card overflow-visible">
      {/* Header */}
      <div className="p-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <p className="text-sm text-[var(--text-dim)] mt-0.5">
            {total} total orders
          </p>
        </div>
        <div className="tabs-pills overflow-x-auto no-scrollbar">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              className={`tab whitespace-nowrap ${status === f.value ? 'active' : ''}`}
              onClick={() => handleStatusChange(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {error ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-8 h-8 text-[var(--danger)] mb-3" />
            <p className="text-sm text-[var(--danger)] font-medium mb-1">
              Failed to load orders
            </p>
            <button onClick={() => mutate()} className="btn btn-sm btn-outline mt-3">
              Retry
            </button>
          </div>
        ) : isLoading && !data ? (
          <TableSkeleton />
        ) : orders.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-[var(--text-dim)]">No orders found</p>
          </div>
        ) : (
          <table className="dark-table">
            <thead>
              <tr>
                <th>Order</th>
                <th className="hidden lg:table-cell">Item</th>
                <th className="hidden md:table-cell">Buyer</th>
                <th>
                  <button
                    className="flex items-center gap-1.5 hover:text-[var(--text-muted)] transition-colors"
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </button>
                </th>
                <th>Status</th>
                <th className="hidden sm:table-cell">
                  <button
                    className="flex items-center gap-1.5 hover:text-[var(--text-muted)] transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </button>
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-[var(--primary)] font-semibold">
                        {order.id}
                      </span>
                      {order.txHash && (
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[0.65rem] text-[var(--text-faint)]">
                            {order.txHash}
                          </span>
                          <CopyButton text={order.txHash} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--surface-3)] overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={order.item.image}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)] line-clamp-1 max-w-[180px]">
                        {order.item.name}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[0.65rem] font-bold text-[var(--text-dim)] flex-shrink-0">
                        {order.buyer.name.charAt(0)}
                      </div>
                      <span className="text-sm text-[var(--text-muted)]">
                        {order.buyer.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white tabular-nums">
                        {order.amount.crypto}
                      </span>
                      <span className="text-[0.7rem] text-[var(--text-faint)] tabular-nums">
                        {order.amount.usd}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill status-${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="text-sm text-[var(--text-dim)] tabular-nums">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </td>
                  <td>
                    <ActionsDropdown orderId={order.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--text-faint)]">
            Page {page} of {totalPages}
          </span>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${pageNum === page ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="page-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
