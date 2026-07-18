"use client";

import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { Message } from "../../lib/api/advisor";

interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
  streamedText: string;
  optimisticUserMessage: string | null;
}

export default function ChatWindow({
  messages,
  isStreaming,
  streamedText,
  optimisticUserMessage,
}: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of window when messages or streams change
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isStreaming, streamedText, optimisticUserMessage]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 md:p-6 overflow-y-auto space-y-6 h-[calc(100vh-20rem)] md:h-[480px] shadow-sm"
    >
      {/* Historical Messages */}
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}

      {/* Optimistic User Send Message */}
      {isStreaming && optimisticUserMessage && (
        <ChatMessage
          message={{
            role: "user",
            content: optimisticUserMessage,
            created_at: new Date().toISOString(),
          }}
        />
      )}

      {/* Streaming Assistant Response */}
      {isStreaming && (
        <div className="space-y-4">
          {streamedText ? (
            <ChatMessage
              message={{
                role: "assistant",
                content: streamedText,
                created_at: new Date().toISOString(),
              }}
            />
          ) : (
            <TypingIndicator />
          )}
        </div>
      )}
    </div>
  );
}
