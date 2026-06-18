import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  price: number;
  image: string;
  currency: string;
};

async function getListings(query: string): Promise<Listing[]> {
  // Replace with your database query
  const items = [
    {
      id: "1",
      title: "Gaming Laptop",
      price: 0.025,
      currency: "BTC",
      image: "/placeholder.jpg",
    },
    {
      id: "2",
      title: "iPhone 15 Pro",
      price: 0.015,
      currency: "BTC",
      image: "/placeholder.jpg",
    },
  ];

  return items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const query = params.q || "";
  const listings = await getListings(query);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Marketplace Search
      </h1>

      {/* Search Form */}
      <form className="flex gap-3 mb-6">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search items..."
          className="flex-1 border rounded px-4 py-2"
        />

        <select
          name="category"
          defaultValue={params.category}
          className="border rounded px-4 py-2"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="phones">Phones</option>
          <option value="gaming">Gaming</option>
        </select>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* Results Count */}
      <p className="mb-4 text-gray-500">
        {listings.length} results found
      </p>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((item) => (
          <Link
            key={item.id}
            href={`/item/${item.id}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="font-semibold">
                {item.title}
              </h2>

              <p className="text-green-600 font-bold mt-2">
                {item.price} {item.currency}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
