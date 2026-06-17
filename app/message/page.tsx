"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send } from "lucide-react";

interface Conversation {
  id: string;
  otherUser: {
    name: string;
    id: string;
  } | null;
  lastMessage: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
}

export default function MessagePage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const sessionResult = useSession();
  const session = sessionResult?.data;

  useEffect(() => {
    if (!session) return;

    const loadConversations = async () => {
      try {
        const res = await fetch("/api/conversations");

        if (!res.ok) {
          setConversations([]);
          return;
        }

        const data = await res.json();
        setConversations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load conversations:", error);
        setConversations([]);
      }
    };

    loadConversations();
  }, [session]);

  useEffect(() => {
    if (!selectedChat) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `/api/messages?conversationId=${selectedChat}`
        );

        if (!res.ok) {
          setMessages([]);
          return;
        }

        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedChat]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedChat) return;

    const form = e.currentTarget;
    const input = form.elements.namedItem(
      "msgInput"
    ) as HTMLInputElement | null;

    if (!input || !input.value.trim()) return;

    const content = input.value.trim();

    const tempMessage: Message = {
      id: Date.now().toString(),
      content,
      senderId: session?.user?.id ?? "",
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedChat,
          content,
        }),
      });

      input.value = "";

      const res = await fetch(
        `/api/messages?conversationId=${selectedChat}`
      );

      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <div className="w-80 border-r border-[var(--border)] flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 rounded-xl cursor-pointer transition-colors ${
                selectedChat === chat.id
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
              }`}
            >
              <span className="font-semibold text-sm">
                {chat.otherUser?.name || "Unknown User"}
              </span>
            </div>
          ))}

          {conversations.length === 0 && (
            <p className="text-sm text-[var(--text-muted)] text-center mt-4">
              No conversations yet.
            </p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--text-muted)]">
              Select a conversation
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === session?.user?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.senderId === session?.user?.id
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--surface)] text-[var(--text)]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)]">
              <form
                onSubmit={handleSendMessage}
                className="flex gap-3 items-center"
              >
                <input
                  name="msgInput"
                  type="text"
                  className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-white outline-none"
                  placeholder="Type your message..."
                />

                <button
                  type="submit"
                  className="primary-btn px-6 flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
