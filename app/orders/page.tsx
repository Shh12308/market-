async function getOrders() {
  const res = await fetch(
    "http://localhost:3000/api/orders"
  );

  return res.json();
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Orders
      </h1>

      {orders.map((order: any) => (
        <div
          key={order.id}
          className="border p-4 mt-4"
        >
          {order.item}
        </div>
      ))}
    </div>
  );
}
