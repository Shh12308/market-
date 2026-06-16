"use client";

import { useState } from "react";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 h-screen">
      
      {/* Sidebar - Conversations */}
      <div className="col-span-1 border-r border-[var(--border)] p-4">
        <h2 className="text-lg font-bold mb-4">Messages</h2>

        <div className="space-y-2">
          <div
            onClick={() => setSelectedChat("chat1")}
            className="p-3 rounded bg-[var(--surface)] cursor-pointer hover:bg-[var(--surface-2)]"
          >
            Seller: John Doe
          </div>

          <div
            onClick={() => setSelectedChat("chat2")}
            className="p-3 rounded bg-[var(--surface)] cursor-pointer hover:bg-[var(--surface-2)]"
          >
            Buyer: Alex
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="col-span-3 flex flex-col">
        
        {/* Messages */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {!selectedChat && (
            <p className="text-gray-400">
              Select a conversation
            </p>
          )}

          {selectedChat && (
            <>
              <div className="bg-[var(--surface)] p-3 rounded w-fit">
                Hey, is this still available?
              </div>

              <div className="bg-[var(--primary)] text-white p-3 rounded w-fit ml-auto">
                Yes, it is available.
              </div>
            </>
          )}
        </div>

        {/* Input */}
        {selectedChat && (
          <div className="p-4 border-t border-[var(--border)] flex gap-2">
            <input
              className="flex-1"
              placeholder="Type a message..."
            />
            <button className="primary-btn">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
