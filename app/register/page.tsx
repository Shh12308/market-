"use client";

import { useState } from "react";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await registerAction(null, formData);

    if (result?.error) {
      if (typeof result.error === "string") {
        setError(result.error);
      } else if (Array.isArray(result.error)) {
        setError(
          result.error
            .map((issue) =>
              typeof issue === "string"
                ? issue
                : issue.message
            )
            .filter(Boolean)
            .join(", ")
        );
      } else if (
        typeof result.error === "object" &&
        "message" in result.error
      ) {
        setError(String(result.error.message));
      } else {
        setError("Registration failed");
      }
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
