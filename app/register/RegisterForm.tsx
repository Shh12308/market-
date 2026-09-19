"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";

const initialState = {
  error: "",
};

export default function RegisterForm() {
  const [state, formAction, pending] =
    useActionState(
      registerAction,
      initialState
    );

  return (
    <form
      action={formAction}
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

      {state?.error && (
        <p className="text-red-500">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded border p-3"
      >
        {pending
          ? "Creating Account..."
          : "Create Account"}
      </button>
    </form>
  );
}
