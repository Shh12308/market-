'use client';

import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

import OrdersTable from '@/components/buyer/OrdersTable';

export default function BuyerOrdersPage() {
  const { data, isLoading } = useSWR('/api/orders', fetcher);

  return (
    <OrdersTable
      orders={data?.orders ?? []}
      loading={isLoading}
    />
  );
}
