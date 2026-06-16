// app/sell/page.tsx

export default function SellPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sell Product</h1>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Price (USDC)"
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          className="w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          List Product
        </button>
      </form>
    </div>
  );
}
