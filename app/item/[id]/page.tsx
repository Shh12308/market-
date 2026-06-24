import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <p>Please sign in to view your orders.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <p>User account not found.</p>
      </div>
    );
  }

  const store = await prisma.store.findFirst({
    where: { userId: user.id },
  });

  if (!store) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <p>You do not have a store yet.</p>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
    include: {
      buyer: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white">Store Orders</h1>
      <p className="text-gray-400 mt-2">
        Manage customer purchases and fulfillment.
      </p>

      <p className="text-2xl font-bold text-green-500 mt-4">
        ${totalRevenue.toFixed(2)}
      </p>

      {orders.map((order) => (
        <div key={order.id}>
          {order.items.map((item) => (
            <div key={item.id}>
              {item.product.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
