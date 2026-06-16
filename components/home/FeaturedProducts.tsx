export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h3 className="mb-6 text-3xl font-bold">Featured Products</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((product) => (
          <div key={product} className="rounded-xl border p-4">
            <div className="mb-4 h-40 rounded bg-gray-200" />

            <h4 className="font-semibold">Product {product}</h4>

            <p className="mt-2 text-gray-600">
              Example product description
            </p>

            <p className="mt-3 font-bold">$99.99</p>

            <button className="mt-4 w-full rounded border py-2">
              View Product
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
