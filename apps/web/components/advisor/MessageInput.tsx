"use client";

import React, { useRef, useEffect } from "react";
import { Send, StopCircle, Trash2 } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  onClear: () => void;
  isStreaming: boolean;
  disabled: boolean;
}

export default function MessageInput({
  value,
  onChange,
  onSubmit,
  onStop,
  onClear,
  isStreaming,
  disabled,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea heights
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
      {/* Text input area */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your business, competitors or growth opportunities..."
        disabled={disabled && !isStreaming}
        className="w-full min-h-[40px] max-h-[120px] bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white text-slate-700 text-xs px-4 py-2.5 rounded-xl placeholder-slate-400 focus:outline-none resize-none transition-all leading-relaxed"
      />

      {/* Buttons toolbar */}
      <div className="flex items-center justify-between">
        {/* Left side actions */}
        <button
          onClick={onClear}
          disabled={disabled || isStreaming}
          className="px-3 py-2 border border-slate-100 hover:bg-slate-50 disabled:opacity-40 text-slate-500 hover:text-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Clear all messages from view"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>

        {/* Right side actions */}
        <div className="flex gap-2">
          {isStreaming ? (
            <button
              onClick={onStop}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <StopCircle className="w-4 h-4 text-rose-500" />
              <span>Stop Generating</span>
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={disabled || !value.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:shadow-none text-white rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-500/10 cursor-pointer"
            >
              <span>Send Query</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
