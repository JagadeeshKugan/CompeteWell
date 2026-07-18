import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdvisorApi, Conversation, Message } from "../lib/api/advisor";
import { useState, useRef } from "react";

export function useAdvisor(selectedLocationId?: string) {
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  // Storing the optimistic user message locally during the stream, so it appears instantly
  const [optimisticUserMessage, setOptimisticUserMessage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Fetch businesses
  const { data: businesses = [], isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ["advisor", "businesses"],
    queryFn: () => AdvisorApi.getBusinesses(),
  });

  // 2. Fetch conversations
  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ["advisor", "conversations", selectedLocationId],
    queryFn: () => AdvisorApi.getConversations(selectedLocationId),
    enabled: !!selectedLocationId,
  });

  // 3. Fetch conversation detail
  const { data: activeConversation, isLoading: isLoadingActiveConversation } = useQuery({
    queryKey: ["advisor", "conversation", activeConversationId],
    queryFn: () => AdvisorApi.getConversationDetail(activeConversationId!),
    enabled: !!activeConversationId,
  });

  // 4. Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: ({ locationId, orgId, title }: { locationId: string; orgId: string; title?: string }) =>
      AdvisorApi.createConversation(locationId, orgId, title),
    onSuccess: (newConv) => {
      queryClient.invalidateQueries({ queryKey: ["advisor", "conversations", selectedLocationId] });
      setActiveConversationId(newConv.id);
    },
  });

  // 5. Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: (id: string) => AdvisorApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advisor", "conversations", selectedLocationId] });
      if (activeConversationId) {
        queryClient.invalidateQueries({ queryKey: ["advisor", "conversation", activeConversationId] });
      }
      setActiveConversationId(null);
    },
  });

  // Stop generation function
  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  // Streaming Send Message function
  const sendMessage = async (content: string) => {
    if (!content.trim() || !selectedLocationId) return;

    setIsStreaming(true);
    setStreamedText("");
    setOptimisticUserMessage(content);
    
    abortControllerRef.current = new AbortController();

    let currentConvId = activeConversationId;

    try {
      const response = await fetch("/api/advisor/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          conversation_id: activeConversationId || undefined,
          location_id: selectedLocationId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to stream chat.");
      }

      // Check header for new conversation ID (if we started a new chat)
      const headerConvId = response.headers.get("X-Conversation-Id");
      if (headerConvId) {
        currentConvId = headerConvId;
        setActiveConversationId(headerConvId);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No readable stream in response.");
      }

      let assistantResponseText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantResponseText += chunk;
        setStreamedText(assistantResponseText);
      }

      // After successful stream completes, refetch database queries
      if (currentConvId) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["advisor", "conversations", selectedLocationId] }),
          queryClient.invalidateQueries({ queryKey: ["advisor", "conversation", currentConvId] })
        ]);
      }

    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user.");
      } else {
        console.error("Streaming error:", err);
        setStreamedText((prev) => prev + `\n\n[Error: ${err.message || "Failed to get response"}]`);
      }
    } finally {
      setIsStreaming(false);
      setOptimisticUserMessage(null);
      setStreamedText("");
    }
  };

  return {
    businesses,
    isLoadingBusinesses,
    conversations,
    isLoadingConversations,
    activeConversation,
    isLoadingActiveConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation: createConversationMutation.mutate,
    isCreatingConversation: createConversationMutation.isPending,
    deleteConversation: deleteConversationMutation.mutate,
    sendMessage,
    isStreaming,
    streamedText,
    optimisticUserMessage,
    stopGenerating,
  };
}
export type UseAdvisorReturn = ReturnType<typeof useAdvisor>;
