import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <h1 className="cursor-pointer text-2xl font-bold gradient-text">
            MARKET
          </h1>
        </Link>

        <input
          type="text"
          placeholder="Search products..."
          className="w-[500px] rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none"
        />

        <div className="flex gap-3">
          <Link href="/login">
            <button className="rounded-lg border border-slate-700 px-4 py-2">
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className="rounded-lg bg-blue-600 px-4 py-2">
              Register
            </button>
          </Link>

          <Link href="/cart">
            <button className="rounded-lg border border-slate-700 px-4 py-2">
              Cart
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
