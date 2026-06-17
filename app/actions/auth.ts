"use server";

import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

// Add 'prevState' as the first argument
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/seller",
    });
  } catch (error) {
    return { error: "Invalid credentials" };
  }
}

// Add 'prevState' as the first argument
export async function registerAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data.error || "Registration failed" };
  }

  redirect("/login");
}
