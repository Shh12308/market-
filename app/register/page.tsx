"use client";

import { useFormState } from "react-dom";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  // Initialize form state to capture return values (errors)
  const [state, formAction] = useFormState(registerAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8">
        <h1 className="mb-6 text-3xl font-bold">
          Create Account
        </h1>

        <form action={formAction} className="space-y-4">
          {/* name="username" is required for formData.get("username") */}
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="w-full rounded border p-3"
          />

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

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full rounded border p-3"
          />

          {/* Display error message if it exists */}
          {state?.error && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
              {state.error}
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
