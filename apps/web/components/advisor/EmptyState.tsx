"use client";

import React from "react";
import { MessageSquareCode, Sparkles } from "lucide-react";
import SuggestedQuestions from "./SuggestedQuestions";

interface EmptyStateProps {
  onSelectQuestion: (question: string) => void;
}

export default function EmptyState({ onSelectQuestion }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 max-w-4xl mx-auto w-full text-center">
      {/* Consulting Illustration Logo */}
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6 shadow-sm relative group">
        <MessageSquareCode className="w-8 h-8" />
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shadow animate-pulse">
          <Sparkles className="w-3 h-3" />
        </span>
      </div>

      {/* Main Headers */}
      <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-2">
        Ask your Business Advisor
      </h2>
      
      <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed mb-10">
        Get personalized, professional recommendations and strategic advice based on your business profile, competitors, and recent local performance metrics.
      </p>

      {/* Suggested prompt card list */}
      <div className="w-full">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left mb-4">
          Suggested Consulting Scenarios
        </h4>
        <SuggestedQuestions onSelectQuestion={onSelectQuestion} />
      </div>
    </div>
  );
}
