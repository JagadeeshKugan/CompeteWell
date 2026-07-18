"use client";

import React from "react";
import { Plus, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { Conversation } from "../../lib/api/advisor";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  isCreating: boolean;
}

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreateNew,
  onDelete,
  isLoading,
  isCreating,
}: ConversationSidebarProps) {
  return (
    <div className="w-full md:w-64 bg-white border border-slate-100 rounded-2xl p-4 flex flex-col h-[calc(100vh-12rem)] md:h-[600px] shadow-sm">
      {/* New Conversation Button */}
      <button
        onClick={onCreateNew}
        disabled={isCreating}
        className="w-full h-10 px-4 mb-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        {isCreating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        <span>New Conversation</span>
      </button>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
          Recent Advisor Chats
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 px-2 leading-relaxed">
            No past conversations. Start a new one above.
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                className={`group flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                  isActive
                    ? "bg-slate-50 text-slate-900 font-semibold"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                <button
                  onClick={() => onSelect(conv.id)}
                  className="flex-1 flex items-center gap-2.5 min-w-0 text-left cursor-pointer py-1"
                >
                  <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="truncate pr-1">{conv.title}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Are you sure you want to delete this conversation?")) {
                      onDelete(conv.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-all cursor-pointer"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
