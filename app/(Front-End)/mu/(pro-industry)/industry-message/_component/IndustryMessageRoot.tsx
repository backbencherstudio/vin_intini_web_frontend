"use client";

import MessageBubble, { getMessagePreview } from "@/app/(Front-End)/mu/message/_component/MessageBubble";
import MessageContextMenu from "@/app/(Front-End)/mu/message/_component/MessageContextMenu";
import MessageInputBar from "@/app/(Front-End)/mu/message/_component/MessageInputBar";
import { useMessageScroller } from "@/app/(Front-End)/mu/message/_component/useMessageScroller";
import {
  useDeleteIndustryMessageMutation,
  useReactIndustryMessageMutation,
  useSendIndustryMessageMutation,
} from "@/feature/slice/message/industryMessageSlice";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type UIEvent,
} from "react";
import toast from "react-hot-toast";
import IndustryChatHeader from "./IndustryChatHeader";
import { useIndustryConversationEcho } from "./useIndustryConversationEcho";
import { useIndustryConversationMessages } from "./useIndustryConversationMessages";

function getFileCategory(file: File | null) {
  if (!file) return null;
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.includes("pdf")) return "pdf";
  return "file";
}

function getMessageType(file: File | null) {
  if (!file) return "text";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

function IndustryMessageRoot() {
  const params = useParams();
  const conversationId = params?.id as string;

  const [sendMessage] = useSendIndustryMessageMutation();
  const [reactMessage] = useReactIndustryMessageMutation();
  const [deleteMessage] = useDeleteIndustryMessageMutation();

  const canLoadMoreRef = useRef(true);
  const optimisticIdRef = useRef(0);

  const [replyTo, setReplyTo] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{
    msg: any;
    x: number;
    y: number;
  } | null>(null);
  const [highlightedId, setHighlightedId] = useState<any>(null);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    containerRef,
    scrollToBottom,
    captureScrollSnapshot,
    restoreScrollSnapshot,
  } = useMessageScroller();

  const handleInitialLoad = useCallback(() => {
    requestAnimationFrame(() => scrollToBottom(false));
  }, [scrollToBottom]);

  const {
    conversation,
    chatMessages,
    isInitialLoading,
    isConversationError,
    retryLoadConversation,
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
  } = useIndustryConversationMessages(conversationId, handleInitialLoad);

  useEffect(() => {
    setReplyTo(null);
    setContextMenu(null);
  }, [conversationId]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    };
  }, []);

  const messagesById = useMemo(() => {
    const map = new Map<number, any>();
    chatMessages.forEach((m: any) => map.set(Number(m.id), m));
    return map;
  }, [chatMessages]);

  const getReplyText = useCallback(
    (replyId: any) => {
      const found = messagesById.get(Number(replyId));
      return found ? getMessagePreview(found) : "Original message";
    },
    [messagesById],
  );

  const handleMessageContextMenu = useCallback(
    (msg: any) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setContextMenu({ msg, x: e.clientX, y: e.clientY });
    },
    [],
  );

  const handleCloseContextMenu = useCallback(() => setContextMenu(null), []);

  const handleMenuReply = useCallback(() => {
    if (!contextMenu) return;
    setReplyTo(contextMenu.msg);
    setContextMenu(null);
  }, [contextMenu]);

  const handleMenuDelete = useCallback(async () => {
    if (!contextMenu) return;
    const id = contextMenu.msg.id;
    setContextMenu(null);
    if (replyTo?.id === id) setReplyTo(null);
    try {
      await deleteMessage({
        messageId: id,
        conversationId,
      }).unwrap();
      removeMessage(id);
    } catch (error) {
      console.error("Failed to delete industry message", error);
      toast.error("Could not delete message. Please try again.");
    }
  }, [contextMenu, conversationId, deleteMessage, removeMessage, replyTo]);

  const jumpToMessage = useCallback((targetId: any) => {
    const el = document.getElementById(`message-${targetId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(targetId);
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(() => setHighlightedId(null), 1500);
  }, []);

  const handleIncomingMessage = useCallback(
    async (data: any) => {
      const newMsg = data?.message?.id ? data.message : data;
      if (!newMsg?.id || newMsg.is_mine) return;

      appendMessage(newMsg);
      requestAnimationFrame(() => scrollToBottom());

      try {
        await markConversationRead(newMsg.conversation_id);
      } catch (err) {
        console.error("Error marking read", err);
      }
    },
    [appendMessage, markConversationRead, scrollToBottom],
  );

  const handleReactionChanged = useCallback(
    (data: any) => {
      const { message_id, reactions } = data || {};
      if (!message_id || !reactions) return;
      updateMessageReactions(message_id, reactions);
    },
    [updateMessageReactions],
  );

  const handleMessageDeleted = useCallback(
    (data: any) => {
      if (Number(data?.conversation_id) !== Number(conversationId)) return;
      if (data?.message_id) removeMessage(Number(data.message_id));
    },
    [conversationId, removeMessage],
  );

  const latestMessageIdRef = useRef(0);
  useEffect(() => {
    latestMessageIdRef.current = chatMessages.reduce(
      (latestId, message) => Math.max(latestId, Number(message.id) || 0),
      0,
    );
  }, [chatMessages]);

  const handleConnectionRestored = useCallback(() => {
    if (latestMessageIdRef.current > 0) {
      return syncMessagesAfter(latestMessageIdRef.current);
    }
  }, [syncMessagesAfter]);

  useIndustryConversationEcho({
    conversationId,
    onMessageSent: handleIncomingMessage,
    onMessageDeleted: handleMessageDeleted,
    onReactionChanged: handleReactionChanged,
    onConnectionRestored: handleConnectionRestored,
  });

  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollTop > 150) {
      canLoadMoreRef.current = true;
    }
    if (container.scrollTop > 15 || !canLoadMoreRef.current || !hasMore || !nextCursor) {
      return;
    }
    canLoadMoreRef.current = false;
    captureScrollSnapshot(container);
    await loadOlderPage();
    restoreScrollSnapshot();
  };

  const handleSendText = useCallback(
    async (content: string, file: File | null): Promise<boolean> => {
      if (!conversationId) return false;
      const fileType = file ? getMessageType(file) : "text";
      const fileCategory = getFileCategory(file);

      optimisticIdRef.current -= 1;
      const tempId = optimisticIdRef.current;
      const optimisticMessage: any = {
        id: tempId,
        conversation_id: Number(conversationId),
        is_mine: true,
        type: fileType,
        message: content || null,
        file_url: file ? URL.createObjectURL(file) : null,
        file_name: file?.name ?? null,
        file_size: file?.size ?? null,
        file_category: fileCategory,
        reply_to: replyTo?.id ? messagesById.get(Number(replyTo.id)) ?? null : null,
        reactions: [],
        created_at: new Date().toISOString(),
      };

      appendMessage(optimisticMessage);
      const repliedId = replyTo?.id;
      setReplyTo(null);
      requestAnimationFrame(() => scrollToBottom(true));

      const formData = new FormData();
      formData.append("type", fileType);
      if (content) formData.append("message", content);
      if (file) formData.append("file", file);
      if (repliedId) formData.append("reply_to_id", String(repliedId));

      try {
        const response = await sendMessage({
          conversationId,
          data: formData,
        }).unwrap();
        const serverMessage = response.data;
        replaceMessage(tempId, serverMessage);
        return true;
      } catch (error: any) {
        console.error("Failed to send industry message", error);
        removeMessage(tempId);
        toast.error(error?.data?.message || "Failed to send message. Please try again.");
        return false;
      }
    },
    [appendMessage, conversationId, messagesById, removeMessage, replaceMessage, replyTo, scrollToBottom, sendMessage],
  );

  const handleSendVoice = useCallback(
    async (blob: Blob) => {
      if (!conversationId) return;

      const tempId = --optimisticIdRef.current;
      const objectUrl = URL.createObjectURL(blob);
      const optimisticMessage: any = {
        id: tempId,
        conversation_id: Number(conversationId),
        is_mine: true,
        type: "voice",
        message: null,
        file_url: objectUrl,
        file_name: "voice.wav",
        reactions: [],
        created_at: new Date().toISOString(),
      };

      appendMessage(optimisticMessage);
      const repliedId = replyTo?.id;
      setReplyTo(null);
      requestAnimationFrame(() => scrollToBottom(true));

      const formData = new FormData();
      formData.append("type", "voice");
      formData.append("file", blob, "voice.wav");
      if (repliedId) formData.append("reply_to_id", String(repliedId));

      try {
        const response = await sendMessage({
          conversationId,
          data: formData,
        }).unwrap();
        replaceMessage(tempId, response.data);
      } catch (err: any) {
        console.error("Voice send failed", err);
        removeMessage(tempId);
        toast.error("Failed to send voice message.");
      }
    },
    [appendMessage, conversationId, removeMessage, replaceMessage, replyTo, scrollToBottom, sendMessage],
  );

  const handleReact = useCallback(
    async (messageId: number, emoji: string) => {
      try {
        const res = await reactMessage({
          messageId,
          conversationId,
          data: { reaction: emoji },
        }).unwrap();
        if (res?.reactions) {
          updateMessageReactions(messageId, res.reactions);
        }
      } catch (error: any) {
        console.error("Error reacting to message", error);
        toast.error("Could not update reaction.");
      }
    },
    [conversationId, reactMessage, updateMessageReactions],
  );

  const targetParticipant = conversation?.user;
  const isIndustryView = conversation?.mode !== "user";

  return (
    <div className="flex flex-col h-full min-h-[550px] relative">
      <IndustryChatHeader
        user={targetParticipant}
        industry={conversation?.industry}
        mode={isIndustryView ? "industry" : "user"}
      />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]"
      >
        {isLoadingOlder && (
          <div className="text-center text-xs text-gray-400 py-2">
            Loading older messages…
          </div>
        )}

        {chatMessages.length === 0 && !isInitialLoading && (
          <div className="text-center text-gray-400 text-sm py-12">
            Start a conversation with {targetParticipant?.name || "this user"}.
          </div>
        )}

        {chatMessages.map((msg: any) => (
          <div
            key={msg.id}
            id={`message-${msg.id}`}
            className="transition-colors rounded-lg"
          >
            <MessageBubble
              msg={msg}
              highlighted={highlightedId === msg.id}
              otherUserName={targetParticipant?.name || "User"}
              onReact={handleReact}
              onViewFile={(url) => window.open(url, "_blank")}
              onContextMenu={handleMessageContextMenu(msg)}
              onJumpToReply={jumpToMessage}
              getReplyText={getReplyText}
            />
          </div>
        ))}
      </div>

      {contextMenu && (
        <MessageContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          canDelete={Boolean(contextMenu.msg.is_mine)}
          onClose={handleCloseContextMenu}
          onReply={handleMenuReply}
          onDelete={handleMenuDelete}
        />
      )}

      <MessageInputBar
        onSendText={handleSendText}
        onSendVoice={handleSendVoice}
        onTyping={() => {}}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        isConnected={{ is_connected: true }}
        isConversationLoading={isInitialLoading}
        isConversationError={isConversationError}
        onRetryLoadConversation={() => void retryLoadConversation()}
      />
    </div>
  );
}

export default IndustryMessageRoot;
