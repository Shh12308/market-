import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  
  // 1. Check Auth
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  // 2. Extract User ID (Fixes TypeScript Error)
  const currentUserId = session.user.id;

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          id: currentUserId, // Use the variable here
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

  // 3. Format data to separate "Me" from "Other User"
  const formattedConversations = conversations.map((conv) => {
    const otherUser = conv.participants.find((u) => u.id !== currentUserId); // Use the variable here
    
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
