"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send } from "lucide-react";

interface Conversation {
  id: string;
  otherUser: { name: string; id: string } | null;
  lastMessage: string;
}

export default function MessagePage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch("/api/conversations")
        .then((res) => res.json())
        .then((data) => setConversations(data));
    }
  }, [session]);

  useEffect(() => {
    if (selectedChat) {
      fetch(`/api/messages?conversationId=${selectedChat}`)
        .then((res) => res.json())
        .then((data) => setMessages(data));
    }
  }, [selectedChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("msgInput") as HTMLInputElement;
    
    if (!input.value.trim() || !selectedChat) return;

    const tempMessage = {
      id: Date.now().toString(),
      content: input.value,
      senderId: session?.user?.id,
    };
    setMessages((prev) => [...prev, tempMessage]);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: selectedChat,
        content: input.value,
      }),
    });

    input.value = "";
    const res = await fetch(`/api/messages?conversationId=${selectedChat}`);
    setMessages(await res.json());
  };

  return (
    <div className="flex h-screen bg-[var(--background)]">
      <div className="w-80 border-r border-[var(--border)] flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-white tracking-tight">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 rounded-xl cursor-pointer ${
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
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--text-muted)]">Select a conversation</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-2xl ${
                    msg.senderId === session?.user?.id 
                      ? "bg-[var(--primary)] text-white" 
                      : "bg-[var(--surface)] text-[var(--text)]"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)]">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  name="msgInput"
                  className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-white"
                  placeholder="Type your message..."
                />
                <button type="submit" className="primary-btn px-6">Send</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
