import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8">
        <h1 className="mb-6 text-3xl font-bold">Login</h1>

        {/* Add the action here */}
        <form action={loginAction} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded border p-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded border p-3"
          />

          <button
            type="submit"
            className="w-full rounded border p-3"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
