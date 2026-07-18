"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, Check, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { useBusiness } from "../../../hooks/useBusiness";
import { useAdvisor } from "../../../hooks/useAdvisor";
import ConversationSidebar from "../../../components/advisor/ConversationSidebar";
import ChatWindow from "../../../components/advisor/ChatWindow";
import MessageInput from "../../../components/advisor/MessageInput";
import BusinessContextPanel from "../../../components/advisor/BusinessContextPanel";
import EmptyState from "../../../components/advisor/EmptyState";

export default function BusinessAdvisorPage() {
  // Bridge existing dashboard selectors
  const { selectedBusiness: globalBizName, setSelectedBusiness: setGlobalBizName } = useBusiness();
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const {
    businesses,
    isLoadingBusinesses,
    conversations,
    isLoadingConversations,
    activeConversation,
    isLoadingActiveConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    isCreatingConversation,
    deleteConversation,
    sendMessage,
    isStreaming,
    streamedText,
    optimisticUserMessage,
    stopGenerating,
  } = useAdvisor(selectedLocationId || undefined);

  // Sync selected location ID with global selected business name
  useEffect(() => {
    if (businesses.length > 0) {
      const match = businesses.find((b) => b.name === globalBizName);
      if (match) {
        setSelectedLocationId(match.id);
      } else if (!selectedLocationId) {
        setSelectedLocationId(businesses[0].id);
        setGlobalBizName(businesses[0].name);
      }
    }
  }, [businesses, globalBizName, selectedLocationId, setGlobalBizName]);

  // Find active business object
  const activeBusiness = useMemo(() => {
    return businesses.find((b) => b.id === selectedLocationId) || null;
  }, [businesses, selectedLocationId]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const msg = inputMessage;
    setInputMessage("");
    sendMessage(msg);
  };

  const handleSelectQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleNewChat = () => {
    if (activeBusiness) {
      createConversation({
        locationId: activeBusiness.id,
        orgId: activeBusiness.organization_id,
        title: "New Conversation",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-[10px] text-blue-600 font-bold tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Consultant Mode</span>
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
            Business Advisor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ask professional questions about local SEO ranking, Google reviews, and competitor comparisons.
          </p>
        </div>

        {/* Location selector and controls */}
        <div className="flex items-center gap-3">
          {isLoadingBusinesses ? (
            <div className="h-10 px-4 flex items-center bg-white border border-slate-100 rounded-xl">
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="h-10 px-4 bg-white border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
              >
                <span>{activeBusiness?.name || "Select Location"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showLocationDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-lg p-1.5 z-40">
                  {businesses.map((biz) => (
                    <button
                      key={biz.id}
                      onClick={() => {
                        setSelectedLocationId(biz.id);
                        setGlobalBizName(biz.name);
                        setShowLocationDropdown(false);
                        // Clear active conversation on business switch to load clean context
                        setActiveConversationId(null);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-left cursor-pointer"
                    >
                      <span>{biz.name}</span>
                      {selectedLocationId === biz.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleNewChat}
            disabled={isCreatingConversation || !selectedLocationId}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-500/10 active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: Recent Chats */}
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
          onCreateNew={handleNewChat}
          onDelete={deleteConversation}
          isLoading={isLoadingConversations}
          isCreating={isCreatingConversation}
        />

        {/* Center: Interactive Chat Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 w-full">
          {isLoadingActiveConversation ? (
            <div className="bg-white border border-slate-100 rounded-2xl h-[480px] flex items-center justify-center shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                <span className="text-xs text-slate-400 font-medium">Retrieving message history...</span>
              </div>
            </div>
          ) : activeConversationId && activeConversation ? (
            <>
              {/* Chat history window */}
              <ChatWindow
                messages={activeConversation.messages}
                isStreaming={isStreaming}
                streamedText={streamedText}
                optimisticUserMessage={optimisticUserMessage}
              />

              {/* Message Input Panel */}
              <MessageInput
                value={inputMessage}
                onChange={setInputMessage}
                onSubmit={handleSendMessage}
                onStop={stopGenerating}
                onClear={() => setActiveConversationId(null)}
                isStreaming={isStreaming}
                disabled={!selectedLocationId}
              />
            </>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm min-h-[520px] flex flex-col justify-center">
              <EmptyState onSelectQuestion={handleSelectQuestion} />
            </div>
          )}
        </div>

        {/* Right Side: Active Business Context Sidebar (Desktop) */}
        <div className="w-full lg:w-fit flex-shrink-0">
          <BusinessContextPanel business={activeBusiness} />
        </div>
      </div>
    </div>
  );
}
