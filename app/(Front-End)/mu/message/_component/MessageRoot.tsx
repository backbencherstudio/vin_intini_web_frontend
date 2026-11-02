"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteMessageMutation,
  useReactForeMessageMutation,
  useSendMessageMutation,
} from "@/feature/slice/message/messageSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type UIEvent,
} from "react";
import MessageBubble, { getMessagePreview } from "./MessageBubble";
import MessageContextMenu from "./MessageContextMenu";
import MessageInputBar from "./MessageInputBar";
import MessageSectionHeader from "./MessageSectionHeader";
import TypingIndicator from "./TypingIndicator";
import { useConversationEcho } from "./useConversationEcho";
import { useConversationMessages } from "./useConversationMessages";
import { useMessageScroller } from "./useMessageScroller";

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

function MessageRoot() {
  const params = useParams();
  const conversationId = params?.id as string;
  const { data: profileData } = useGetUserProfileQuery("profile");
  const currentUserId = profileData?.user?.id;

  const [sendMessage] = useSendMessageMutation();
  const [reactForeMessage] = useReactForeMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
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
  } = useConversationMessages(conversationId, handleInitialLoad);

  useEffect(() => {
    setReplyTo(null);
    setContextMenu(null);
  }, [conversationId]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current)
        clearTimeout(highlightTimeoutRef.current);
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
      console.error("Failed to delete message", error);
      toast.error("Could not delete the message. Please try again.");
    }
  }, [contextMenu, conversationId, deleteMessage, removeMessage, replyTo]);

  const jumpToMessage = useCallback((targetId: any) => {
    const el = document.getElementById(`message-${targetId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedId(targetId);
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(
      () => setHighlightedId(null),
      1500,
    );
  }, []);

  const handleIncomingMessage = useCallback(
    async (data: any) => {
      const newMsg = data?.message?.id ? data.message : data;

      if (
        !newMsg?.id ||
        newMsg.is_mine ||
        Number(newMsg.sender_id) === Number(currentUserId)
      ) {
        return;
      }

      appendMessage(newMsg);
      requestAnimationFrame(() => scrollToBottom());

      try {
        await markConversationRead(newMsg.conversation_id);
      } catch (error: any) {
        console.log(
          error?.message,
          "error occurs while marking message as read",
        );
      }
    },
    [appendMessage, currentUserId, markConversationRead, scrollToBottom],
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

  const { isOtherUserTyping, whisperTyping, connectionState } = useConversationEcho({
    conversationId,
    onMessageSent: handleIncomingMessage,
    onMessageDeleted: handleMessageDeleted,
    onReactionChanged: handleReactionChanged,
    onConnectionRestored: handleConnectionRestored,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOtherUserTyping) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom > 120) return;

    const id = requestAnimationFrame(() => scrollToBottom(false));
    return () => cancelAnimationFrame(id);
  }, [isOtherUserTyping, containerRef, scrollToBottom]);

  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    if (container.scrollTop > 150) {
      canLoadMoreRef.current = true;
    }

    if (
      container.scrollTop > 15 ||
      !canLoadMoreRef.current ||
      !hasMore ||
      !nextCursor
    ) {
      return;
    }

    canLoadMoreRef.current = false;
    captureScrollSnapshot(container);

    const res = await loadOlderPage(nextCursor);
    if (!res?.data?.length) return;

    prependOlderMessages(res.data);
    restoreScrollSnapshot();
  };

  const handleSendText = useCallback(
    (content: string, file: File | null): Promise<boolean> => {
      if (!conversationId) return Promise.resolve(false);

      const tempId = --optimisticIdRef.current;
      const messageType = getMessageType(file);
      const objectUrl = file ? URL.createObjectURL(file) : null;
      const optimisticMessage = {
        id: tempId,
        send_status: "sending",
        conversation_id: Number(conversationId),
        sender_id: currentUserId,
        is_mine: true,
        type: messageType,
        message: content || null,
        file_url: objectUrl,
        file_name: file?.name ?? null,
        file_size: file?.size ?? null,
        file_extension: file ? file.name.split(".").pop() : null,
        file_category: getFileCategory(file),
        duration: null,
        reply_to_id: replyTo?.id ?? null,
        reply_to: replyTo
          ? {
              id: replyTo.id,
              message: replyTo.message,
              type: replyTo.type,
              file_name: replyTo.file_name,
              is_mine: replyTo.is_mine,
            }
          : null,
        reactions: [],
        created_at: new Date().toISOString(),
      };
      appendMessage(optimisticMessage);
      requestAnimationFrame(() => scrollToBottom());

      const formData = new FormData();
      formData.append("type", messageType);
      formData.append("message", content);
      if (file) formData.append("file", file);
      if (replyTo?.id != null) {
        formData.append("reply_to_id", String(replyTo.id));
      }
      setReplyTo(null);
      void sendMessage({ conversationId, data: formData })
        .unwrap()
        .then((response: any) => {
          const serverMsg = response?.data || response?.message;
          if (!serverMsg?.id) throw new Error("Message response did not include an id.");
          replaceMessage(tempId, { ...serverMsg, is_mine: true });
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        })
        .catch((error) => {
          console.error("Failed to send message", error);
          replaceMessage(tempId, {
            ...optimisticMessage,
            file_url: null,
            send_status: "failed",
          });
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          toast.error("Message failed to send. Please try again.");
        });
      return Promise.resolve(true);
    },
    [
      appendMessage,
      conversationId,
      currentUserId,
      removeMessage,
      replaceMessage,
      replyTo,
      scrollToBottom,
      sendMessage,
    ],
  );

  const handleSendVoice = useCallback(
    (blob: Blob) => {
      if (!conversationId) return;

      const tempId = --optimisticIdRef.current;
      const objectUrl = URL.createObjectURL(blob);

      const optimisticMessage = {
        id: tempId,
        send_status: "sending",
        conversation_id: Number(conversationId),
        sender_id: currentUserId,
        is_mine: true,
        type: "voice",
        message: null,
        file_url: objectUrl,
        file_name: "voice-message.mp3",
        file_size: blob.size,
        file_extension: "mp3",
        file_category: "audio",
        duration: null,
        reply_to_id: null,
        reply_to: null,
        reactions: [],
        created_at: new Date().toISOString(),
      };
      appendMessage(optimisticMessage);
      requestAnimationFrame(() => scrollToBottom());

      const formData = new FormData();
      formData.append("type", "voice");
      formData.append("message", "");
      formData.append("file", blob, "voice-message.mp3");

      void sendMessage({
          conversationId,
          data: formData,
        })
        .unwrap()
        .then((response: any) => {
          const serverMsg = response?.data || response?.message;
          if (!serverMsg?.id) throw new Error("Message response did not include an id.");
          replaceMessage(tempId, { ...serverMsg, is_mine: true });
          URL.revokeObjectURL(objectUrl);
        })
        .catch((error) => {
          console.error("Failed to send voice message", error);
          replaceMessage(tempId, {
            ...optimisticMessage,
            file_url: null,
            send_status: "failed",
          });
          URL.revokeObjectURL(objectUrl);
          toast.error("Voice message failed to send. Please try again.");
        });
    },
    [
      appendMessage,
      conversationId,
      currentUserId,
      removeMessage,
      replaceMessage,
      scrollToBottom,
      sendMessage,
    ],
  );

  const handleReactMessage = useCallback(
    async (messageId: number, emoji: string) => {
      try {
        await reactForeMessage({
          messageId,
          conversationId,
          data: { reaction: emoji },
        }).unwrap();
      } catch (error) {
        console.error("Failed to react to message", error);
        toast.error("Could not add the reaction. Please try again.");
      }
    },
    [conversationId, reactForeMessage],
  );

  const handleViewFile = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);


  return (
    <div>
      <div className="h-full md:pl-4 bg-white">
        <div className="border rounded-2xl w-full flex flex-col">
          {isInitialLoading ? (
            <div className="flex items-center p-3 gap-3 rounded-xl">
              <Skeleton className="h-10 w-10" />
              <div>
                <Skeleton className="h-4 w-32 mt-2" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
          ) : (
            <MessageSectionHeader
              conversationList={conversation}
              isOtherUserTyping={isOtherUserTyping}
              connectionState={connectionState}
            />
          )}

          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="lg:h-135 md:h-115 h-105 border-t overflow-y-auto px-3! py-6! md:p-6! space-y-5.5 overscroll-contain"
          >
            {isInitialLoading && (
              <div className="space-y-3.5 py-2">
                {/* Initial conversation loading placeholder. */}
                <div className="flex items-end gap-2.5 justify-start">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0 bg-gray-200" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-10 w-48 sm:w-64 rounded-2xl rounded-bl-xs bg-gray-200" />
                    <Skeleton className="h-2.5 w-12 ml-1 bg-gray-200" />
                  </div>
                </div>
              </div>
            )}

            {isLoadingOlder && (
              <p className="text-center text-xs text-gray-400" role="status">
                Loading older messages…
              </p>
            )}

            {chatMessages.map((msg: any) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                highlighted={highlightedId === msg.id}
                otherUserName={conversation?.other_user?.name}
                onReact={handleReactMessage}
                onViewFile={handleViewFile}
                onContextMenu={handleMessageContextMenu(msg)}
                onJumpToReply={jumpToMessage}
                getReplyText={getReplyText}
              />
            ))}

            {isOtherUserTyping && <TypingIndicator />}
          </div>
          <MessageInputBar
            isConnected={conversation?.other_user}
            isConversationLoading={isInitialLoading}
            isConversationError={isConversationError}
            onRetryLoadConversation={() => void retryLoadConversation()}
            replyTo={replyTo}
            onTyping={whisperTyping}
            onCancelReply={() => setReplyTo(null)}
            onSendText={handleSendText}
            onSendVoice={handleSendVoice}
          />
        </div>
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
    </div>
  );
}

export default MessageRoot;
