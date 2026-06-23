import { notFound } from "next/navigation";

async function getItem(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/listings/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="card overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-[var(--text-muted)] mb-2">
            {item.category}
          </p>

          <h1 className="text-4xl font-bold text-white mb-4">
            {item.title}
          </h1>

          <p className="text-4xl font-bold text-[var(--success)] mb-6">
            ${Number(item.price).toLocaleString()}
          </p>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">
                Condition
              </p>

              <p className="text-white">
                {item.condition}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">
                Seller
              </p>

              <p className="text-white">
                {item.sellerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-[var(--text-muted)] mb-1">
                Description
              </p>

              <p className="text-[var(--text-secondary)] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="primary-btn flex-1">
              Buy Now
            </button>

            <button className="secondary-btn flex-1">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
