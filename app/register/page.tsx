export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8">
        <h1 className="mb-6 text-3xl font-bold">
          Create Account
        </h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded border p-3"
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full rounded border p-3"
          />

          <button
            type="submit"
            className="w-full rounded border p-3"
          >
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}
