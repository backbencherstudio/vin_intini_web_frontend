"use client";

import MessageBubble from "@/app/(Front-End)/mu/message/_component/MessageBubble";
import MessageInputBar from "@/app/(Front-End)/mu/message/_component/MessageInputBar";
import { useMessageScroller } from "@/app/(Front-End)/mu/message/_component/useMessageScroller";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useGetIndustryConversationMessagesQuery,
  useReactIndustryMessageMutation,
  useSendIndustryMessageMutation,
  useStartIndustryConversationWithIndustryMutation,
} from "@/feature/slice/message/industryMessageSlice";
import emptyImage from "@/public/empty_user.jpg";
import { Loader2, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useIndustryConversationEcho } from "../../industry-message/_component/useIndustryConversationEcho";

interface IndustryMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  industryId: number | string;
  industryData: any;
}

export default function IndustryMessageModal({
  isOpen,
  onClose,
  industryId,
  industryData,
}: IndustryMessageModalProps) {
  const [conversationId, setConversationId] = useState<number | string | null>(null);
  const [startConversation, { isLoading: isStarting }] =
    useStartIndustryConversationWithIndustryMutation();

  const [sendMessage] = useSendIndustryMessageMutation();
  const [reactMessage] = useReactIndustryMessageMutation();

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const optimisticIdRef = useRef(0);
  const { containerRef, scrollToBottom } = useMessageScroller();

  useEffect(() => {
    if (!isOpen || !industryId) return;

    let isMounted = true;
    startConversation(industryId)
      .unwrap()
      .then((res: any) => {
        if (isMounted && res?.data?.id) {
          setConversationId(res.data.id);
        }
      })
      .catch((err: any) => {
        console.error("Failed to start industry conversation", err);
        toast.error(err?.data?.message || "Failed to open conversation.");
        onClose();
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, industryId, startConversation, onClose]);

  const { data: messagesData, isLoading: isMessagesLoading } =
    useGetIndustryConversationMessagesQuery(conversationId!, {
      skip: !conversationId,
    });

  useEffect(() => {
    if (messagesData?.data) {
      setChatMessages(messagesData.data);
      requestAnimationFrame(() => scrollToBottom(false));
    }
  }, [messagesData?.data, scrollToBottom]);

  const handleIncomingMessage = useCallback(
    (data: any) => {
      const newMsg = data?.message?.id ? data.message : data;
      if (!newMsg?.id || newMsg.is_mine) return;
      setChatMessages((prev) =>
        prev.some((m) => Number(m.id) === Number(newMsg.id))
          ? prev
          : [...prev, { ...newMsg, is_mine: false }],
      );
      requestAnimationFrame(() => scrollToBottom());
    },
    [scrollToBottom],
  );

  useIndustryConversationEcho({
    conversationId: conversationId || "",
    onMessageSent: handleIncomingMessage,
    onMessageDeleted: (data: any) => {
      if (data?.message_id) {
        setChatMessages((prev) => prev.filter((m) => Number(m.id) !== Number(data.message_id)));
      }
    },
    onReactionChanged: (data: any) => {
      if (data?.message_id && data?.reactions) {
        setChatMessages((prev) =>
          prev.map((m) =>
            Number(m.id) === Number(data.message_id) ? { ...m, reactions: data.reactions } : m,
          ),
        );
      }
    },
    onConnectionRestored: () => {},
  });

  const handleSendText = useCallback(
    async (content: string, file: File | null): Promise<boolean> => {
      if (!conversationId) return false;
      const fileType = file ? "file" : "text";

      optimisticIdRef.current -= 1;
      const tempId = optimisticIdRef.current;
      const optimisticMsg = {
        id: tempId,
        conversation_id: Number(conversationId),
        is_mine: true,
        type: fileType,
        message: content || null,
        file_url: file ? URL.createObjectURL(file) : null,
        file_name: file?.name ?? null,
        reactions: [],
        created_at: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, optimisticMsg]);
      requestAnimationFrame(() => scrollToBottom(true));

      const formData = new FormData();
      formData.append("type", fileType);
      if (content) formData.append("message", content);
      if (file) formData.append("file", file);

      try {
        const res = await sendMessage({
          conversationId,
          data: formData,
        }).unwrap();
        setChatMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...res.data, is_mine: true } : m)),
        );
        return true;
      } catch (err: any) {
        console.error("Failed to send message", err);
        setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
        toast.error(err?.data?.message || "Failed to send message.");
        return false;
      }
    },
    [conversationId, scrollToBottom, sendMessage],
  );

  const handleSendVoice = useCallback(
    async (blob: Blob) => {
      if (!conversationId) return;

      const tempId = --optimisticIdRef.current;
      const objectUrl = URL.createObjectURL(blob);
      const optimisticMsg = {
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

      setChatMessages((prev) => [...prev, optimisticMsg]);
      requestAnimationFrame(() => scrollToBottom(true));

      const formData = new FormData();
      formData.append("type", "voice");
      formData.append("file", blob, "voice.wav");

      try {
        const res = await sendMessage({
          conversationId,
          data: formData,
        }).unwrap();
        setChatMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...res.data, is_mine: true } : m)),
        );
      } catch (err) {
        console.error("Failed to send voice message", err);
        setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
        toast.error("Failed to send voice message.");
      }
    },
    [conversationId, scrollToBottom, sendMessage],
  );

  const handleReact = useCallback(
    async (messageId: number, emoji: string) => {
      if (!conversationId) return;
      try {
        await reactMessage({
          messageId,
          conversationId,
          data: { reaction: emoji },
        }).unwrap();
      } catch (err) {
        console.error("Failed to react", err);
      }
    },
    [conversationId, reactMessage],
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-xl border border-gray-200">
        <DialogHeader className="p-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 border border-gray-200">
              <Image
                src={industryData?.logo || emptyImage}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                alt={industryData?.name || "Company"}
              />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-semibold text-headerColor truncate">
                {industryData?.name || "Industry"}
              </DialogTitle>
              <p className="text-xs text-descriptionColor truncate">
                {industryData?.tagline || industryData?.industry || "Company Inbox"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {isStarting || isMessagesLoading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-primaryColor" />
            <span className="text-xs">Connecting to company inbox…</span>
          </div>
        ) : (
          <div className="flex flex-col h-[480px]">
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <MessageSquare className="w-8 h-8 text-primaryColor/60 mb-2" />
                  <p className="text-sm font-medium text-headerColor">
                    Message {industryData?.name || "this Company"}
                  </p>
                  <p className="text-xs text-descriptionColor max-w-xs mt-1">
                    Send an inquiry, ask about open roles, or reach out to the industry team directly.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg: any) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    otherUserName={industryData?.name || "Company"}
                    onReact={handleReact}
                    onViewFile={(url) => window.open(url, "_blank")}
                  />
                ))
              )}
            </div>

            <MessageInputBar
              onSendText={handleSendText}
              onSendVoice={handleSendVoice}
              onTyping={() => {}}
              replyTo={null}
              onCancelReply={() => {}}
              isConnected={{ is_connected: true }}
              isConversationLoading={false}
              isConversationError={false}
              onRetryLoadConversation={() => {}}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
