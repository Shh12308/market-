export default function Navbar() {
  return (
    <nav className="border-b p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-2xl font-bold">Marketplace</h1>

        <input
          type="text"
          placeholder="Search products..."
          className="w-96 rounded-lg border px-4 py-2"
        />

        <div className="flex gap-4">
          <button>Login</button>
          <button>Register</button>
          <button>Cart</button>
        </div>
      </div>
    </nav>
  );
}
