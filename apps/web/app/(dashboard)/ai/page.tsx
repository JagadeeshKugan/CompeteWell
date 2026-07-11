"use client";

import React, { useState } from "react";
import { Sparkles, Send } from "lucide-react";

export default function AiAssistantPage() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello! I am your AI Market Assistant. Ask me anything about your competitor metrics or reports." },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatMessage("");

    // Simulate AI thinking and response
    setTimeout(() => {
      let response = "I've analyzed your current workspace. The overall business health score looks stable.";
      if (userMsg.toLowerCase().includes("competitor")) {
        response = "We detected 3 new competitors in a 5 mi radius for Downtown Coffee Co. Roast & Co is currently gaining social traction.";
      } else if (userMsg.toLowerCase().includes("seo") || userMsg.toLowerCase().includes("search")) {
        response = "Your Local SEO score is 68/100. Keywords like 'fresh ground coffee' show room for 15% optimization.";
      }
      setChatHistory((prev) => [...prev, { sender: "ai", text: response }]);
    }, 800);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm h-[520px] flex flex-col">
      <div className="p-5 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-slate-800 text-sm">AI Copilot</span>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-bold">
          Online
        </span>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-md p-3 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-50 flex gap-2">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Ask a question about local competitors..."
          className="flex-1 h-10 px-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-sm shadow-blue-500/10 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
