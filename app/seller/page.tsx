export default function SellerDashboard() {
  const stats = [
    {
      title: "Total Sales",
      value: "£12,450",
      change: "+12%",
    },
    {
      title: "Active Listings",
      value: "48",
      change: "+4",
    },
    {
      title: "Orders",
      value: "127",
      change: "+18",
    },
    {
      title: "Pending Payout",
      value: "£2,140",
      change: "Processing",
    },
  ];

  const listings = [
    {
      id: 1,
      title: "Apple iPhone 15 Pro",
      price: "£799",
      status: "Active",
      views: 324,
    },
    {
      id: 2,
      title: "PlayStation 5",
      price: "£450",
      status: "Sold",
      views: 212,
    },
    {
      id: 3,
      title: "MacBook Air M3",
      price: "£999",
      status: "Active",
      views: 578,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>

          <button className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">
            + New Listing
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
              <p className="mt-2 text-green-600 text-sm">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Listings */}
          <div className="lg:col-span-2 rounded-xl bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="font-semibold text-lg">Recent Listings</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Views</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {listings.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-4 font-medium">{item.title}</td>
                      <td className="p-4">{item.price}</td>
                      <td className="p-4">{item.views}</td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-blue-600 hover:underline">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Quick Actions</h3>

              <div className="mt-4 flex flex-col gap-3">
                <button className="rounded-lg bg-black py-2 text-white">
                  Add Product
                </button>

                <button className="rounded-lg border py-2">
                  View Orders
                </button>

                <button className="rounded-lg border py-2">
                  Withdraw Funds
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Recent Orders</h3>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="font-medium">Order #1001</p>
                  <p className="text-sm text-gray-500">
                    iPhone 15 Pro • £799
                  </p>
                </div>

                <div>
                  <p className="font-medium">Order #1002</p>
                  <p className="text-sm text-gray-500">
                    PS5 • £450
                  </p>
                </div>

                <div>
                  <p className="font-medium">Order #1003</p>
                  <p className="text-sm text-gray-500">
                    MacBook Air • £999
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
