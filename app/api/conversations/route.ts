import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          id: session.user.id,
        },
      },
    },
    include: {
      participants: true, // Get user details to show names
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // Get the last message for preview
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Format data to separate "Me" from "Other User"
  const formattedConversations = conversations.map((conv) => {
    const otherUser = conv.participants.find((u) => u.id !== session.user.id);
    return {
      id: conv.id,
      otherUser: otherUser
        ? { name: otherUser.name || otherUser.username, id: otherUser.id }
        : null,
      lastMessage: conv.messages[0]?.content || "No messages yet",
      updatedAt: conv.updatedAt,
    };
  });

  return NextResponse.json(formattedConversations);
}
