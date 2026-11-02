"use client";

import echo from "@/lib/echo";
import { CookieHelper } from "@/helper/cookie.helper";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseConversationEchoArgs {
  conversationId: string;
  onMessageSent: (data: any) => void | Promise<void>;
  onMessageDeleted: (data: any) => void;
  onReactionChanged: (data: any) => void;
  onConnectionRestored: () => void | Promise<void>;
}

export function useConversationEcho({
  conversationId,
  onMessageSent,
  onMessageDeleted,
  onReactionChanged,
  onConnectionRestored,
}: UseConversationEchoArgs) {
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [connectionState, setConnectionState] = useState<string>("connecting");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingAtRef = useRef(0);

  useEffect(() => {
    if (!echo || !conversationId) {
      return;
    }

    const token = CookieHelper.get({ key: "accessToken" });
    echo.connector.options.auth.headers.Authorization = token ? `Bearer ${token}` : "";

    const pusherConnection = echo.connector.pusher.connection;
    const updateConnectionState = (state: { current: string; previous: string }) => {
      setConnectionState(state.current);
      if (state.current === "connected" && state.previous !== "connected") {
        void onConnectionRestored();
      }
    };
    pusherConnection.bind("state_change", updateConnectionState);
    setConnectionState(pusherConnection.state);

    const channelName = `conversation.${conversationId}`;
    const channel = echo.private(channelName);

    const handleMessageSent = async (data: any) => {
      await onMessageSent(data);
      setIsOtherUserTyping(false);
    };

    const handleTypingEvent = () => {
      setIsOtherUserTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsOtherUserTyping(false);
      }, 2500);
    };

    channel.error(() => setConnectionState("subscription_error"));
    channel.listen(".MessageSent", handleMessageSent);
    channel.listen(".MessageDeleted", onMessageDeleted);
    channel.listen(".MessageReactionChanged", onReactionChanged);
    channel.listenForWhisper("typing", handleTypingEvent);

    return () => {
      pusherConnection.unbind("state_change", updateConnectionState);
      channel.stopListening(".MessageSent", handleMessageSent);
      channel.stopListening(".MessageDeleted", onMessageDeleted);
      channel.stopListening(".MessageReactionChanged", onReactionChanged);
      channel.stopListeningForWhisper("typing", handleTypingEvent);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      echo.leave(channelName);
    };
  }, [conversationId, onMessageSent, onMessageDeleted, onReactionChanged, onConnectionRestored]);

  const whisperTyping = useCallback(() => {
    if (!echo || !conversationId) return;
    const now = Date.now();
    if (now - lastTypingAtRef.current > 1000) {
      lastTypingAtRef.current = now;
      echo
        .private(`conversation.${conversationId}`)
        .whisper("typing", { typing: true });
    }
  }, [conversationId]);

  return {
    isOtherUserTyping,
    whisperTyping,
    connectionState: !echo || !conversationId ? "unavailable" : connectionState,
  };
}
