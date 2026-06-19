import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; 
export const revalidate = 0;

export default async function OrdersPage() {
  let orders = [];

  try {
    orders = await prisma.order.findMany({
      include: {
        items: true,
        buyer: true,
        store: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to load orders:", error);
  }

  return (
    <div>
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <p>Order: {order.id}</p>
            <p>Status: {order.status}</p>
            <p>Total: {String(order.total)}</p>
          </div>
        ))
      )}
    </div>
  );
}
