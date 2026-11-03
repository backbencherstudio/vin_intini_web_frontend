"use client";

import echo from "@/lib/echo";
import { CookieHelper } from "@/helper/cookie.helper";
import { useEffect, useRef, useState } from "react";

interface UseIndustryConversationEchoArgs {
  conversationId: string | number;
  onMessageSent: (data: any) => void | Promise<void>;
  onMessageDeleted: (data: any) => void;
  onReactionChanged: (data: any) => void;
  onConnectionRestored: () => void | Promise<void>;
}

export function useIndustryConversationEcho({
  conversationId,
  onMessageSent,
  onMessageDeleted,
  onReactionChanged,
  onConnectionRestored,
}: UseIndustryConversationEchoArgs) {
  const [connectionState, setConnectionState] = useState<string>("connecting");

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

    const channelName = `industry-conversation.${conversationId}`;
    const channel = echo.private(channelName);

    const handleMessageSent = async (data: any) => {
      await onMessageSent(data);
    };

    const handleMessageDeleted = (data: any) => {
      onMessageDeleted(data);
    };

    const handleReactionChanged = (data: any) => {
      onReactionChanged(data);
    };

    channel.listen(".IndustryMessageSent", handleMessageSent);
    channel.listen(".IndustryMessageDeleted", handleMessageDeleted);
    channel.listen(".IndustryMessageReactionChanged", handleReactionChanged);

    return () => {
      pusherConnection.unbind("state_change", updateConnectionState);
      channel.stopListening(".IndustryMessageSent", handleMessageSent);
      channel.stopListening(".IndustryMessageDeleted", handleMessageDeleted);
      channel.stopListening(".IndustryMessageReactionChanged", handleReactionChanged);
      echo.leave(channelName);
    };
  }, [conversationId, onMessageSent, onMessageDeleted, onReactionChanged, onConnectionRestored]);

  return { connectionState };
}

