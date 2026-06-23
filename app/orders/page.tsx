import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: {
      ownerId: session.user.id,
    },
  });

  if (!store) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-4 text-gray-500">
          No store found.
        </p>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      storeId: store.id,
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          listing: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    Order #{order.id}
                  </p>

                  <p className="text-sm text-gray-500">
                    Buyer: {order.buyer?.name}
                  </p>
                </div>

                <div className="text-right">
                  <p>{order.status}</p>
                  <p className="font-bold">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm py-1"
                  >
                    <span>
                      {item.listing?.title}
                    </span>

                    <span>
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
