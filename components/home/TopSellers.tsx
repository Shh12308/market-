export default function TopSellers() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h3 className="mb-6 text-3xl font-bold">Top Sellers</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h4 className="font-semibold">SellerOne</h4>
          <p className="text-gray-600">1,250 sales</p>
        </div>

        <div className="rounded-xl border p-6">
          <h4 className="font-semibold">SellerTwo</h4>
          <p className="text-gray-600">980 sales</p>
        </div>

        <div className="rounded-xl border p-6">
          <h4 className="font-semibold">SellerThree</h4>
          <p className="text-gray-600">875 sales</p>
        </div>
      </div>
    </section>
  );
}
