"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/auth"; // Helper to get session client-side
import { useSession } from "next-auth/react"; // If using NextAuth client provider

interface Conversation {
  id: string;
  otherUser: { name: string; id: string } | null;
  lastMessage: string;
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const { data: session } = useSession();

  // 1. Fetch Chat List
  useEffect(() => {
    if (session) {
      fetch("/api/conversations")
        .then((res) => res.json())
        .then((data) => setConversations(data));
    }
  }, [session]);

  // 2. Fetch Messages when chat selected
  useEffect(() => {
    if (selectedChat) {
      fetch(`/api/messages?conversationId=${selectedChat}`)
        .then((res) => res.json())
        .then((data) => setMessages(data));
    }
  }, [selectedChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem("msgInput") as HTMLInputElement;
    
    if (!input.value.trim() || !selectedChat) return;

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selectedChat,
        content: input.value,
      }),
    });

    input.value = ""; // Clear input
    // Re-fetch messages (in a real app, use WebSockets/Pusher)
    const res = await fetch(`/api/messages?conversationId=${selectedChat}`);
    setMessages(await res.json());
  };

  return (
    <div className="grid grid-cols-4 h-screen">
      {/* Sidebar */}
      <div className="col-span-1 border-r border-[var(--border)] p-4">
        <h2 className="text-lg font-bold mb-4">Messages</h2>
        <div className="space-y-2">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-3 rounded cursor-pointer ${
                selectedChat === chat.id ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)] hover:bg-[var(--surface-2)]"
              }`}
            >
              {chat.otherUser?.name || "Unknown"}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="col-span-3 flex flex-col">
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {!selectedChat && <p className="text-gray-400">Select a conversation</p>}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded w-fit max-w-xs ${
                msg.senderId === session?.user?.id
                  ? "bg-[var(--primary)] text-white ml-auto"
                  : "bg-[var(--surface)]"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {selectedChat && (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border)] flex gap-2">
            <input
              name="msgInput"
              className="flex-1 rounded border p-3"
              placeholder="Type a message..."
            />
            <button type="submit" className="primary-btn">
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
