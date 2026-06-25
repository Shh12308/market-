"use client";

import { useState } from "react";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const result = await registerAction(null, formData);

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8">
        <h1 className="mb-6 text-3xl font-bold">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="username"
            required
            placeholder="Username"
            className="w-full rounded border p-3"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full rounded border p-3"
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded border p-3"
          />

          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
            className="w-full rounded border p-3"
          />

          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

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
