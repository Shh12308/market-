"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send } from "lucide-react";

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
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("msgInput") as HTMLInputElement;
    
    if (!input.value.trim() || !selectedChat) return;

    // Optimistic UI Update (Optional: Show message immediately)
    const tempMessage = {
      id: Date.now().toString(),
      content: input.value,
      senderId: session?.user?.id,
      createdAt: new Date(),
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

    input.value = ""; // Clear input
  };

  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <div className="w-80 border-r border-[var(--border)] flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-white tracking-tight">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.length === 0 ? (
             <p className="text-[var(--text-muted)] text-sm text-center mt-4">No conversations yet</p>
          ) : (
            conversations.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                  selectedChat === chat.id 
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary-glow)]" 
                    : "bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-white border border-transparent hover:border-[var(--border)]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm truncate">
                    {chat.otherUser?.name || "Unknown User"}
                  </span>
                  {/* Optional: Unread indicator */}
                  {selectedChat !== chat.id && <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>}
                </div>
                <p className="text-xs opacity-80 truncate">
                  {chat.lastMessage}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col relative">
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center bg-[var(--surface)]/30">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 className="text-lg font-bold text-white">Select a conversation</h3>
              <p className="text-[var(--text-muted)] text-sm">Choose a chat from the left to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--background)]">
              {messages.map((msg) => {
                const isMe = msg.senderId === session?.user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white rounded-tr-sm"
                          : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)]">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  name="msgInput"
                  autoComplete="off"
                  className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder-[var(--text-dim)]"
                  placeholder="Type your message..."
                />
                <button 
                  type="submit" 
                  className="primary-btn px-6 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
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
