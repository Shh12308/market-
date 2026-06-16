export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8">
        <h1 className="mb-6 text-3xl font-bold">
          Login
        </h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border p-3"
          />

          <input
            type="password"
            placeholder="Password"
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
