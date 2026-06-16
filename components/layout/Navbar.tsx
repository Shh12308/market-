import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/">
          <h1 className="cursor-pointer text-2xl font-bold">
            Marketplace
          </h1>
        </Link>

        <input
          type="text"
          placeholder="Search products..."
          className="w-96 rounded-lg border px-4 py-2"
        />

        <div className="flex gap-4">
          <Link href="/login">
            <button className="rounded border px-4 py-2">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="rounded border px-4 py-2">
              Register
            </button>
          </Link>

          <Link href="/cart">
            <button className="rounded border px-4 py-2">
              Cart
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
