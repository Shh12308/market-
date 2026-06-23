import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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
    where: {
      email: session.user.email,
    },
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
    where: {
      userId: user.id,
    },
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
    where: {
      storeId: store.id,
    },
    include: {
      buyer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Store Orders
          </h1>

          <p className="text-gray-400 mt-2">
            Manage customer purchases and fulfillment.
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-sm text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-green-500">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <p className="text-gray-400">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg text-white">
                    Order #{order.id.slice(0, 8)}
                  </h2>

                  <p className="text-sm text-gray-400">
                    Buyer:{" "}
                    {order.buyer.username ||
                      order.buyer.name ||
                      order.buyer.email}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-start lg:items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "DELIVERED"
                        ? "bg-green-500/20 text-green-400"
                        : order.status === "SHIPPED"
                        ? "bg-blue-500/20 text-blue-400"
                        : order.status === "PAID"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : order.status === "CANCELLED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-zinc-700 text-gray-300"
                    }`}
                  >
                    {order.status}
                  </span>

                  <p className="text-xl font-bold text-white mt-2">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-800 pt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Items
                </h3>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-white">
                        {item.product.title}
                      </span>

                      <span className="text-gray-400">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
