"use server";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import argon2 from "argon2";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function registerAction(
  _prevState: unknown,
  formData: FormData
) {
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { username, email, password } = parsed.data;

  try {
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return {
        error: "An account with this email already exists.",
      };
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return {
        error: "That username is already taken.",
      };
    }

    const passwordHash = await argon2.hash(password);

    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return {
      error: "Something went wrong while creating your account.",
    };
  }

  redirect("/login");
}

export async function loginAction(
  _prevState: unknown,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });

    return {
      error: "",
    };
  } catch (error) {
    // NextAuth uses a thrown redirect internally.
    // Re-throw it so Next.js can perform the redirect.
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Login error:", error);

    return {
      error: "Invalid email or password.",
    };
  }
}
