"use client";

import {
  useReactForeMessageMutation,
  useSendMessageMutation,
} from "@/feature/slice/message/messageSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, type UIEvent } from "react";
import MessageBubble from "./MessageBubble";
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

function MessageRoot() {
  const params = useParams();
  const conversationId = params?.id as string;
  const { data: profileData } = useGetUserProfileQuery("profile");
  const currentUserId = profileData?.user?.id;

  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [reactForeMessage] = useReactForeMessageMutation();
  const canLoadMoreRef = useRef(true);

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
    isFetchingMore,
    nextCursor,
    hasMore,
    appendMessage,
    prependOlderMessages,
    replaceMessage,
    removeMessage,
    updateMessageReactions,
    markConversationRead,
    loadOlderPage,
  } = useConversationMessages(conversationId, handleInitialLoad);

  const handleIncomingMessage = useCallback(
    async (data: any) => {
      const newMsg = data?.message?.id ? data.message : data;

      if (!newMsg?.id || newMsg.is_mine || newMsg.sender_id === currentUserId) {
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

  const { isOtherUserTyping, whisperTyping } = useConversationEcho({
    conversationId,
    onMessageSent: handleIncomingMessage,
    onReactionChanged: handleReactionChanged,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOtherUserTyping) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
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
    (content: string, file: File | null) => {
      if (!conversationId) return;

      const tempId = Date.now();
      appendMessage({
        id: tempId,
        conversation_id: Number(conversationId),
        sender_id: currentUserId,
        is_mine: true,
        type: file ? "file" : "text",
        message: content || null,
        file_url: file ? URL.createObjectURL(file) : null,
        file_name: file?.name ?? null,
        file_size: file?.size ?? null,
        file_extension: file ? file.name.split(".").pop() : null,
        file_category: getFileCategory(file),
        duration: null,
        reply_to: null,
        reactions: [],
        created_at: new Date().toISOString(),
      });
      requestAnimationFrame(() => scrollToBottom());

      const formData = new FormData();
      formData.append("type", file ? "file" : "text");
      formData.append("message", content);
      if (file) formData.append("file", file);

      sendMessage({ conversationId, data: formData })
        .unwrap()
        .then((response: any) => {
          const serverMsg = response?.data || response?.message;
          if (serverMsg?.id) {
            replaceMessage(tempId, { ...serverMsg, is_mine: true });
          }
        })
        .catch((error) => {
          console.error("Failed to send message", error);
          removeMessage(tempId);
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

  const handleSendVoice = useCallback(
    async (blob: Blob) => {
      if (!conversationId) return;
      const formData = new FormData();
      formData.append("type", "voice");
      formData.append("message", "");
      formData.append("file", blob, "voice-message.mp3");
      try {
        await sendMessage({ conversationId, data: formData }).unwrap();
      } catch (error) {
        console.error("Failed to send voice message", error);
      }
    },
    [conversationId, sendMessage],
  );

  const handleReactMessage = useCallback(
    async (messageId: number, emoji: string) => {
      try {
        await reactForeMessage({
          messageId,
          data: { reaction: emoji },
        }).unwrap();
      } catch (error) {
        console.error("Failed to react to message", error);
      }
    },
    [reactForeMessage],
  );

  const handleViewFile = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <div>
      <div className="h-full md:pl-4 bg-white">
        <div className="border rounded-2xl w-full flex flex-col">
          <MessageSectionHeader
            conversationList={conversation}
            isOtherUserTyping={isOtherUserTyping}
          />

          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="md:h-135 h-100 border-t overflow-y-auto p-3! md:p-6! space-y-4 overscroll-contain"
          >
            {isFetchingMore && (
              <div className="flex justify-center py-2">
                <span className="text-xs text-gray-400 animate-pulse">
                  Loading older messages...
                </span>
              </div>
            )}

            {chatMessages.map((msg: any) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onReact={handleReactMessage}
                onViewFile={handleViewFile}
              />
            ))}

            {isOtherUserTyping && <TypingIndicator />}
          </div>

          <MessageInputBar
            isConnected={Boolean(conversation?.other_user?.is_connected)}
            sending={sendingMessage}
            onTyping={whisperTyping}
            onSendText={handleSendText}
            onSendVoice={handleSendVoice}
          />
        </div>
      </div>
    </div>
  );
}

export default MessageRoot;
