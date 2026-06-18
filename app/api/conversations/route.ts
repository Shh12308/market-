import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentUserId = session.user.id;

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          id: currentUserId,
        },
      },
    },
    include: {
      participants: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const formattedConversations = conversations.map((conv) => {
    const otherUser = conv.participants.find(
      (u) => u.id !== currentUserId
    );

    return {
      id: conv.id,

      otherUser: otherUser
        ? {
            id: otherUser.id,
            username: otherUser.username ?? "Unknown",
          }
        : null,

      lastMessage: conv.messages[0]?.content ?? "No messages yet",
      updatedAt: conv.updatedAt,
    };
  });

  return NextResponse.json(formattedConversations);
}
