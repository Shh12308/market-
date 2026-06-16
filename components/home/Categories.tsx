export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h3 className="mb-6 text-3xl font-bold">Categories</h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-6">Electronics</div>
        <div className="rounded-xl border p-6">Software</div>
        <div className="rounded-xl border p-6">Books</div>
        <div className="rounded-xl border p-6">Gaming</div>
        <div className="rounded-xl border p-6">Services</div>
        <div className="rounded-xl border p-6">Digital Goods</div>
        <div className="rounded-xl border p-6">Fashion</div>
        <div className="rounded-xl border p-6">Accessories</div>
      </div>
    </section>
  );
}
