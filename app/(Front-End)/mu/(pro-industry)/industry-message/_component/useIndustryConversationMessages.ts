"use client";

import {
  useGetIndustryConversationMessagesQuery,
  useLazyGetIndustryConversationMessagesQuery,
  useMarkReadIndustryMessageMutation,
} from "@/feature/slice/message/industryMessageSlice";
import { useCallback, useEffect, useRef, useState } from "react";

export function useIndustryConversationMessages(
  conversationId: string | number,
  onLoaded?: (res: any) => void,
) {
  const [fetchMessages] = useLazyGetIndustryConversationMessagesQuery();
  const [markReadMessage] = useMarkReadIndustryMessageMutation();

  const [conversation, setConversation] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const isLoadingOlderRef = useRef(false);
  const loadedConversationIdRef = useRef<string | number | null>(null);

  const cachedResult = useGetIndustryConversationMessagesQuery(conversationId, {
    skip: !conversationId,
  });

  useEffect(() => {
    if (!conversationId) return;

    if (cachedResult?.currentData) {
      const res = cachedResult.currentData as any;
      setConversation(res);
      setChatMessages(res?.data || []);
      setNextCursor(res?.next_cursor || null);
      setHasMore(Boolean(res?.has_more || res?.next_cursor));
      if (loadedConversationIdRef.current !== conversationId) {
        loadedConversationIdRef.current = conversationId;
        onLoaded?.(res);
      }
      return;
    }

    setChatMessages([]);
    setConversation(null);
    setNextCursor(null);
    setHasMore(false);
  }, [conversationId, cachedResult?.currentData, onLoaded]);

  const appendMessage = useCallback((msg: any) => {
    if (!msg?.id) return;
    setChatMessages((prev) =>
      prev.some((m) => Number(m.id) === Number(msg.id)) ? prev : [...prev, msg],
    );
  }, []);

  const prependOlderMessages = useCallback((older: any[]) => {
    setChatMessages((prev) => {
      const existingIds = new Set(prev.map((m: any) => Number(m.id)));
      const uniqueOlder = older.filter((m: any) => !existingIds.has(Number(m.id)));
      return [...uniqueOlder, ...prev];
    });
  }, []);

  const replaceMessage = useCallback((optimisticId: any, finalMessage: any) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        m.id === optimisticId || Number(m.id) === Number(optimisticId)
          ? { ...finalMessage, is_mine: true }
          : m,
      ),
    );
  }, []);

  const removeMessage = useCallback((messageId: number) => {
    setChatMessages((prev) => prev.filter((m) => Number(m.id) !== Number(messageId)));
  }, []);

  const updateMessageReactions = useCallback((messageId: number, reactions: any[]) => {
    setChatMessages((prev) =>
      prev.map((m) =>
        Number(m.id) === Number(messageId) ? { ...m, reactions } : m,
      ),
    );
  }, []);

  const markConversationRead = useCallback(
    async (id: number | string) => {
      try {
        await markReadMessage(id).unwrap();
      } catch (err) {
        console.error("Failed to mark industry conversation read", err);
      }
    },
    [markReadMessage],
  );

  const loadOlderPage = useCallback(async () => {
    if (!conversationId || !nextCursor || isLoadingOlderRef.current) return;
    isLoadingOlderRef.current = true;
    setIsLoadingOlder(true);
    try {
      const res = await fetchMessages({
        id: conversationId,
        cursor: nextCursor,
      }).unwrap();
      const older = (res?.data || []).filter(Boolean);
      prependOlderMessages(older);
      setNextCursor(res?.next_cursor || null);
      setHasMore(Boolean(res?.has_more || res?.next_cursor));
    } catch (err) {
      console.error("Failed to load older messages", err);
    } finally {
      isLoadingOlderRef.current = false;
      setIsLoadingOlder(false);
    }
  }, [conversationId, fetchMessages, nextCursor, prependOlderMessages]);

  const syncMessagesAfter = useCallback(
    async (afterId: number) => {
      if (!conversationId) return;
      try {
        const res = await fetchMessages({
          id: conversationId,
          afterId,
        }).unwrap();
        const incoming = (res?.data || []).filter(Boolean);
        if (incoming.length > 0) {
          setChatMessages((prev) => {
            const existingIds = new Set(prev.map((m: any) => Number(m.id)));
            const newOnes = incoming.filter((m: any) => !existingIds.has(Number(m.id)));
            return [...prev, ...newOnes];
          });
        }
      } catch (err) {
        console.error("Failed to sync new messages", err);
      }
    },
    [conversationId, fetchMessages],
  );

  return {
    conversation,
    chatMessages,
    isInitialLoading: cachedResult?.isLoading,
    isConversationError: cachedResult?.isError,
    retryLoadConversation: cachedResult?.refetch,
    isLoadingOlder,
    nextCursor,
    hasMore,
    appendMessage,
    prependOlderMessages,
    replaceMessage,
    removeMessage,
    updateMessageReactions,
    markConversationRead,
    loadOlderPage,
    syncMessagesAfter,
  };
}

