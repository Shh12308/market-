import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2"; // Import Argon2
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // Hash with Argon2
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id, // Recommended type
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    // Create default store
    await prisma.store.create({
      data: {
        name: `${username}'s Store`,
        slug: username.toLowerCase(),
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
  console.error("REGISTER ERROR:", error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.errors },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : String(error),
    },
    { status: 500 }
  );
}
}
