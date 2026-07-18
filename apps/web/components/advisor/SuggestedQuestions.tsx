"use client";

import React from "react";
import { HelpCircle } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

const QUESTIONS = [
  "Why am I losing customers?",
  "How can I rank higher on Google?",
  "Generate a marketing plan.",
  "Generate weekly improvement tasks.",
  "Compare me with my top competitor.",
  "How can I increase reviews?",
  "What should I improve this month?",
  "Analyze my competitors.",
  "Create a social media plan.",
  "Generate SEO recommendations.",
];

export default function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {QUESTIONS.map((question, idx) => (
        <button
          key={idx}
          onClick={() => onSelectQuestion(question)}
          className="flex items-start gap-2.5 p-3.5 text-left border border-slate-100 hover:border-blue-500 hover:bg-blue-50/10 rounded-xl transition-all cursor-pointer bg-white group h-full shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5" />
          <span className="text-xs text-slate-600 group-hover:text-slate-800 font-medium leading-relaxed">
            {question}
          </span>
        </button>
      ))}
    </div>
  );
}
