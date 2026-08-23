"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import baseApiSlice from "@/feature/slice/baseApi";
import {
  useGetConversationMessagesQuery,
  useMarkReadMessageMutation,
  useReactForeMessageMutation,
  useSendMessageMutation,
} from "@/feature/slice/message/messageSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import echo from "@/lib/echo";
import { AttatchIcon, SendIcon, VoiceIcon } from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import MessageFileRenderer from "./MessageFileRenderer";
import MessageReactEmojiAction from "./MessageReactEmojiAction";
import MessageSectionHeader from "./MessageSectionHeader";
import { useVoiceRecorder } from "./useVoiceRecorder";

function MessageRoot() {
  const dispatch = useDispatch();
  const params = useParams();
  const conversationId = params?.id as string;
  const { data: profileData } = useGetUserProfileQuery("profile");
  const { data: conversationList } = useGetConversationMessagesQuery(
    conversationId,
    {
      skip: !conversationId,
    },
  );
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [markReadMessage] = useMarkReadMessageMutation();
  const [reactForeMessage] = useReactForeMessageMutation();
  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<File | null>(null);
  // Typing Indicator States
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Send Voice Message Handler
  const handleSendVoice = async (blob: Blob) => {
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
  };

  // Custom Voice Recorder Hook
  const {
    isRecording,
    recordingSeconds,
    recordingBlob,
    toggleRecording,
    sendRecording,
    discardRecording,
    formatRecordingTime,
  } = useVoiceRecorder(handleSendVoice);

  // Safe Inner-Only Scroll (Locks Outer Layout)
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => scrollToBottom());
    return () => cancelAnimationFrame(id);
  }, [conversationId, chatMessages?.length, isOtherUserTyping]);

  useEffect(() => {
    setChatMessages(conversationList?.data || []);
  }, [conversationId, conversationList]);

  // Echo Listener (Messages, Reactions, and Whispers)
  useEffect(() => {
    if (!echo || !conversationId) return;
    const channelName = `conversation.${conversationId}`;
    const channel = echo.private(channelName);

    const handleMessageSent = async (data: any) => {
      const newMsg = data?.message?.id ? data.message : data;

      // Skip own messages (already handled by optimistic send + API response)
      if (
        !newMsg?.id ||
        newMsg.is_mine ||
        newMsg.sender_id === profileData?.user?.id
      ) {
        return;
      }

      setChatMessages((prev) => {
        if (!newMsg?.id || prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      if (data) {
        try {
          await markReadMessage(newMsg.conversation_id).unwrap();
          dispatch(baseApiSlice.util.invalidateTags(["conversationList"]));
        } catch (error) {
          console.log(
            error?.message,
            "error occurs while marking message as read",
          );
        }
      }

      setIsOtherUserTyping(false);
    };

    const handleMessageReactionChanged = (data: any) => {
      const { message_id, reactions } = data || {};
      if (!message_id || !reactions) return;
      setChatMessages((prev) =>
        prev.map((m) => (m.id === message_id ? { ...m, reactions } : m)),
      );
    };

    const handleTypingEvent = () => {
      setIsOtherUserTyping(true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsOtherUserTyping(false);
      }, 2500);
    };

    channel.listen(".MessageSent", handleMessageSent);
    channel.listen(".MessageReactionChanged", handleMessageReactionChanged);
    channel.listenForWhisper("typing", handleTypingEvent);

    return () => {
      channel.stopListening(".MessageSent", handleMessageSent);
      channel.stopListening(
        ".MessageReactionChanged",
        handleMessageReactionChanged,
      );
      channel.stopListeningForWhisper("typing", handleTypingEvent);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      echo.leave(channelName);
    };
  }, [conversationId, dispatch, profileData?.user?.id]);

  // Throttled Typing Whisper Sender
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    if (!echo || !conversationId) return;
    const now = Date.now();

    if (now - lastTypingTimeRef.current > 1000) {
      lastTypingTimeRef.current = now;
      const channelName = `conversation.${conversationId}`;
      echo.private(channelName).whisper("typing", {
        typing: true,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!conversationId) return;

    if (recordingBlob) {
      await sendRecording();
      return;
    }

    const content = inputValue.trim();
    if (!content && !attachments) return;

    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      conversation_id: Number(conversationId),
      sender_id: profileData?.user?.id,
      is_mine: true,
      type: attachments ? "file" : "text",
      message: content || null,
      file_url: attachments ? URL.createObjectURL(attachments) : null,
      file_name: attachments ? attachments.name : null,
      file_size: attachments ? attachments.size : null,
      file_extension: attachments ? attachments.name.split(".").pop() : null,
      file_category: attachments
        ? attachments.type.startsWith("image/")
          ? "image"
          : attachments.type.startsWith("video/")
            ? "video"
            : attachments.type.includes("pdf")
              ? "pdf"
              : "file"
        : null,
      duration: null,
      reply_to: null,
      reactions: [],
      created_at: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, tempMessage]);
    const fileToSend = attachments;
    setInputValue("");
    setAttachments(null);
    const formData = new FormData();
    formData.append("type", fileToSend ? "file" : "text");
    formData.append("message", content);
    if (fileToSend) formData.append("file", fileToSend);

    try {
      const response = await sendMessage({
        conversationId,
        data: formData,
      }).unwrap();

      const serverMsg = response?.data || response?.message;

      if (serverMsg?.id) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...serverMsg, is_mine: true } : msg,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to send message", error);

      setChatMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };
  const handleViewFile = (url: string) => {
    scrollToBottom();
    window.open(url, "_blank");
  };

  const handleReactMessage = async (messageId: number, emoji: string) => {
    try {
      await reactForeMessage({
        messageId,
        data: { reaction: emoji },
      }).unwrap();
    } catch (error) {
      console.error("Failed to react to message", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachments(file);
    e.target.value = "";
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? inputValue.length;
    const end = textarea.selectionEnd ?? inputValue.length;
    const next = inputValue.slice(0, start) + emoji + inputValue.slice(end);
    setInputValue(next);
    const cursorPos = start + emoji.length;

    requestAnimationFrame(() => {
      textarea.focus({ preventScroll: true });
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  return (
    <div>
      <div className="h-full md:pl-4 bg-white">
        <div className="border  rounded-2xl w-full flex flex-col">
          <>
            {/* Header */}
            <MessageSectionHeader
              conversationList={conversationList}
              isOtherUserTyping={isOtherUserTyping}
            />
            {/* Messages Container (Scoped Scroll, overscroll-contain) */}
            <div
              ref={messagesContainerRef}
              className="md:h-135 h-100 border-t overflow-y-auto p-3! md:p-6! space-y-4 overscroll-contain"
            >
              {chatMessages.map((msg) =>
                !msg.is_mine ? (
                  <div
                    key={msg.id}
                    className="flex group/message items-center gap-2"
                  >
                    <div className="max-w-xs relative bg-[#F3F4F6] border border-[#F3F4F6]! p-2 rounded-t-xl rounded-r-xl text-sm">
                      {msg?.message}
                      {(msg?.type === "file" || msg?.type === "voice") &&
                        msg?.file_url && (
                          <MessageFileRenderer
                            msg={msg}
                            variant="receiver"
                            onViewFile={handleViewFile}
                          />
                        )}
                      {msg?.reactions && msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1 absolute -bottom-3 -right-2 z-10">
                          {msg.reactions.map((react: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded-full shadow-md bg-white border border-gray-100 text-xs flex items-center gap-0.5"
                            >
                              <span>{react.reaction}</span>
                              {react.count > 1 && (
                                <span className="text-[10px] font-semibold text-gray-600">
                                  {react.count}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className=" text-[12px] text-nowrap text-gray-400">
                        {dayjs(msg?.created_at).format("hh:mm A")}
                      </span>
                      <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
                        <MessageReactEmojiAction
                          onReact={handleReactMessage}
                          type="receiver"
                          id={msg.id}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="max-w-xs group/message ml-auto">
                    <div className="flex items-center justify-end w-full gap-2">
                      <div className="flex flex-col items-end">
                        <span className=" text-[12px] text-nowrap text-gray-400">
                          {dayjs(msg?.created_at).format("hh:mm A")}
                        </span>
                        <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
                          <MessageReactEmojiAction
                            onReact={handleReactMessage}
                            type="sender"
                            id={msg.id}
                          />
                        </div>
                      </div>

                      <div className="border relative border-primaryColor bg-primaryColor text-whiteColor p-2 rounded-t-xl rounded-l-xl text-sm">
                        {msg?.message}
                        {(msg?.type === "file" || msg?.type === "voice") &&
                          msg?.file_url && (
                            <MessageFileRenderer
                              msg={msg}
                              variant="sender"
                              onViewFile={handleViewFile}
                            />
                          )}
                        {msg?.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center gap-1 absolute -bottom-3 -left-2 z-10">
                            {msg.reactions.map((react: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded-full shadow-md bg-white text-black border border-gray-100 text-xs flex items-center gap-0.5"
                              >
                                <span>{react.reaction}</span>
                                {react.count > 1 && (
                                  <span className="text-[10px] font-semibold text-gray-600">
                                    {react.count}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}

              {/* Animated Typing Indicator Bubble */}
              {isOtherUserTyping && (
                <div className="flex items-center gap-1.5 bg-[#F3F4F6] text-gray-500 px-3 py-3 rounded-xl rounded-tl-none w-fit text-xs animate-fade-in">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.20s]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  </span>
                </div>
              )}
            </div>

            {/* Input Section */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="p-3 border-t flex flex-col mt-auto">
              {attachments && (
                <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-lg px-3 py-2 text-xs max-w-45 mb-2">
                  <AttatchIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{attachments.name}</span>
                  <button
                    onClick={() => setAttachments(null)}
                    className="text-red-500 cursor-pointer"
                  >
                    <IoClose className="text-sm" />
                  </button>
                </div>
              )}
              {conversationList?.other_user?.is_connected ? (
                <div className="flex items-start gap-1 md:gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer p-1"
                  >
                    <AttatchIcon className="w-4.5 h-4.5" />
                  </button>

                  {recordingBlob ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={discardRecording}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-full cursor-pointer"
                      >
                        <IoClose className="text-base" />
                      </button>
                      <span className="px-2 py-1 bg-[#F3F4F6] rounded-lg text-xs tabular-nums text-headerColor">
                        {formatRecordingTime(recordingSeconds)}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={toggleRecording}
                      className={`p-1 flex items-center gap-1.5 rounded-md transition-colors ${
                        isRecording
                          ? "bg-red-50 text-red-500 px-2"
                          : "text-descriptionColor"
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                          </span>
                          <span className="text-xs font-medium tabular-nums">
                            {formatRecordingTime(recordingSeconds)}
                          </span>
                        </>
                      ) : (
                        <VoiceIcon className="w-4.5 h-4.5" />
                      )}
                    </button>
                  )}

                  <SmartEmojiPicker
                    onEmojiSelect={handleEmojiSelect}
                    iconClassName="w-5 h-5 text-descriptionColor cursor-pointer hover:opacity-80"
                    height={250}
                  />

                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Write message here..."
                    className="w-full resize-none bg-transparent text-[16px] leading-6 text-headerColor placeholder:text-grayColor1 focus:outline-none transition-all"
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage}
                    className="bg-primaryColor text-white px-3 py-3 rounded-sm cursor-pointer disabled:opacity-50"
                  >
                    <SendIcon />
                  </button>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 py-3">
                  You can only send messages to connected users. Please connect
                  with this user to start a conversation.
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default MessageRoot;
