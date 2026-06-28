type Props = {
  orders: any[];
  loading: boolean;
};

export default function OrdersTable({ orders, loading }: Props) {
  if (loading) return <div>Loading...</div>;
  if (!orders.length) return <div>No orders</div>;

  return <div>{/* buyer table UI */}</div>;
}
