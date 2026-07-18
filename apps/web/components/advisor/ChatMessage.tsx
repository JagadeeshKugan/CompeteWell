"use client";

import React from "react";
import { Sparkles, User } from "lucide-react";
import { Message } from "../../lib/api/advisor";

interface ChatMessageProps {
  message: Pick<Message, "role" | "content" | "created_at">;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const dateStr = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`flex gap-3.5 ${isAssistant ? "justify-start" : "justify-end"}`}>
      {/* Icon Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message Balloon */}
      <div className="flex flex-col max-w-2xl min-w-0">
        <div
          className={`px-4 py-3 rounded-2xl ${
            isAssistant
              ? "bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none shadow-sm"
              : "bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-500/10"
          }`}
        >
          {isAssistant ? (
            <div className="space-y-1.5">{parseMarkdown(message.content)}</div>
          ) : (
            <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Timestamp */}
        {dateStr && (
          <span
            className={`text-[9px] text-slate-400 mt-1 font-medium px-1 ${
              isAssistant ? "text-left" : "text-right"
            }`}
          >
            {dateStr}
          </span>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

/**
 * A highly robust, lightweight Markdown parser supporting headers, lists, bold text,
 * and structured Markdown tables without any external libraries.
 */
function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let inList = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const commitList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="list-disc pl-5 my-2 space-y-1 text-xs text-slate-700">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const commitTable = (key: string) => {
    if (tableRows.length > 0 || tableHeaders.length > 0) {
      elements.push(
        <div key={key} className="overflow-x-auto my-3 border border-slate-100 rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse text-[10px] leading-relaxed">
            {tableHeaders.length > 0 && (
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-700">
                  {tableHeaders.map((h, idx) => (
                    <th key={idx} className="py-2 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  {row.map((cell, cidx) => (
                    <td key={cidx} className="py-2.5 px-3 font-medium">{renderInlineMarkdown(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check Table Row
    if (line.startsWith("|")) {
      commitList(`list-pre-table-${i}`);
      const parts = line
        .split("|")
        .map((p) => p.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

      // Check if it's the table divider (e.g. |---|---|)
      if (line.includes("---")) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = parts;
      } else {
        tableRows.push(parts);
      }
      continue;
    } else {
      if (inTable) {
        commitTable(`table-end-${i}`);
      }
    }

    // Check List Item
    if (line.startsWith("- ") || line.startsWith("* ")) {
      commitTable(`table-pre-list-${i}`);
      inList = true;
      listItems.push(line.substring(2));
      continue;
    } else {
      if (inList) {
        commitList(`list-end-${i}`);
      }
    }

    // Check Headers (e.g. ### Header)
    if (line.startsWith("#")) {
      const depth = (line.match(/^#+/) || [""])[0].length;
      const content = line.substring(depth).trim();
      const headerClasses =
        depth === 1
          ? "text-sm font-bold text-slate-800 my-2"
          : depth === 2
          ? "text-xs font-bold text-slate-800 my-1.5"
          : "text-[11px] font-bold text-slate-700 my-1";

      elements.push(
        React.createElement(
          `h${Math.min(depth + 1, 6)}`,
          { key: `h-${i}`, className: headerClasses },
          renderInlineMarkdown(content)
        )
      );
      continue;
    }

    // Spacer or normal paragraph text
    if (line === "") {
      elements.push(<div key={`spacer-${i}`} className="h-1.5" />);
    } else {
      elements.push(
        <p key={`p-${i}`} className="my-1 leading-relaxed text-xs text-slate-700">
          {renderInlineMarkdown(line)}
        </p>
      );
    }
  }

  // Final commits if file ended inside a block
  if (inList) commitList(`list-final`);
  if (inTable) commitTable(`table-final`);

  return elements;
}

/**
 * Handles formatting for inline bold text: **text**
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
