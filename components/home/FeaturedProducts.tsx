export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h2 className="mb-6 text-3xl font-bold">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4"
          >
            <div className="h-48 rounded-lg bg-slate-800" />

            <h3 className="mt-4 font-semibold">
              Product {item}
            </h3>

            <p className="text-sm text-slate-400">
              Seller: MarketplaceSeller
            </p>

            <p className="mt-2 text-2xl font-bold">
              £49.99
            </p>

            <button className="mt-4 w-full rounded-lg bg-blue-600 py-2">
              View Item
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
