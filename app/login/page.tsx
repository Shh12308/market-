"use client"; // Required for hooks like useFormState

import { useFormState } from "react-dom";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  // 1. Initialize form state to capture the return value of the action
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-8">
        <h1 className="mb-6 text-3xl font-bold">Login</h1>

        {/* 2. Use 'formAction' instead of the raw 'loginAction' */}
        <form action={formAction} className="space-y-4">
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

          {/* 3. Display the error if it exists */}
          {state?.error && (
            <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
              {state.error}
            </p>
          )}

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
