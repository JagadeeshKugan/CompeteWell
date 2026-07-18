"use client";

import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start items-center space-x-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100/80 text-slate-500 max-w-xs text-xs rounded-tl-none animate-pulse">
      <span className="font-medium">Advisor is scanning context</span>
      <div className="flex space-x-1">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}
