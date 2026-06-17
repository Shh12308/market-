import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

// GET: Fetch messages for a specific conversation
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ error: "Missing conversation ID" }, { status: 400 });
  }

  // Verify user is part of this conversation
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { id: session.user.id } },
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: true }, // Include sender to know who sent what
      },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  return NextResponse.json(conversation.messages);
}

// POST: Send a new message
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { conversationId, content } = body;

  if (!conversationId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify participation
  const hasAccess = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { id: session.user.id } },
    },
  });

  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      content,
      senderId: session.user.id,
      conversationId,
    },
    include: { sender: true },
  });

  // Update the conversation's updatedAt timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(message);
}
