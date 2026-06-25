import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Watchlist() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Watchlist</h1>
        <p className="mt-4 text-gray-500">
          Please sign in to view your watchlist.
        </p>
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
      <div className="p-8">
        <h1 className="text-3xl font-bold">Watchlist</h1>
        <p className="mt-4 text-gray-500">
          User not found.
        </p>
      </div>
    );
  }

  const watchlist = await prisma.watchlist.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: {
        include: {
          store: true,
          images: true,
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
        Watchlist
      </h1>

      {watchlist.length === 0 ? (
        <p className="text-gray-500">
          No saved products yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border p-4"
            >
              <h2 className="font-semibold text-lg">
                {item.product.title}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {item.product.store.name}
              </p>

              <p className="mt-2 font-bold">
                ${Number(item.product.price).toFixed(2)}
              </p>

              {item.product.description && (
                <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                  {item.product.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
