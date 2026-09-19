"use server";

import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { redirect } from "next/navigation";
import { z } from "zod";

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

  // IMPORTANT: return a STRING, not parsed.error
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const {
    username,
    email,
    password,
  } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
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

  // IMPORTANT: keep redirect OUTSIDE the try/catch
  redirect("/login");
}
