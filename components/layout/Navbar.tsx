import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-500">
            MARKET
          </h1>
        </Link>

        <input
          type="text"
          placeholder="Search for anything"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
        />

        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/cart">Cart</Link>
      </div>
    </nav>
  );
}
