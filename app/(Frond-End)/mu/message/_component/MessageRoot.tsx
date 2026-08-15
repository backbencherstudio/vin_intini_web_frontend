"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import {
  useGetConversationMessagesQuery,
  useReactForeMessageMutation,
  useSendMessageMutation,
} from "@/feature/slice/message/messageSlice";
import echo from "@/lib/echo";
import emptyImage from "@/public/empty_user.jpg";
import { AttatchIcon, SendIcon, VoiceIcon } from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import MessageFileRenderer from "./MessageFileRenderer";
import MessageReactEmojiAction from "./MessageReactEmojiAction";
import { useVoiceRecorder } from "./useVoiceRecorder";

function MessageRoot() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const params = useParams();
  const conversationId = params?.id as string;

  const { data: conversationList } = useGetConversationMessagesQuery(
    conversationId,
    {
      skip: !conversationId,
    },
  );

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [reactForeMessage] = useReactForeMessageMutation();
  const [inputValue, setInputValue] = useState("");
  const [sidarOpen, setSiderOpen] = useState(false);
  const [attachments, setAttachments] = useState<File | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const {
    isRecording,
    recordingSeconds,
    recordingBlob,
    toggleRecording,
    sendRecording,
    discardRecording,
    formatRecordingTime,
  } = useVoiceRecorder(handleSendVoice);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => scrollToBottom());
    return () => cancelAnimationFrame(id);
  }, [conversationId, chatMessages?.length]);

  useEffect(() => {
    setChatMessages(conversationList?.data || []);
  }, [conversationId, conversationList]);

  // Echo Listener
  useEffect(() => {
    if (!echo || !conversationId) return;
    const channelName = `conversation.${conversationId}`;
    const channel = echo.private(channelName);

    const handleMessageSent = (data: any) => {
      const newMsg = data?.message?.id ? data.message : data;
      setChatMessages((prev) => {
        if (!newMsg?.id || prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    };

    const handleMessageReactionChanged = (data: any) => {
      const { message_id, reactions } = data || {};
      if (!message_id || !reactions) return;
      setChatMessages((prev) =>
        prev.map((m) => (m.id === message_id ? { ...m, reactions } : m)),
      );
    };

    channel.listen(".MessageSent", handleMessageSent);
    channel.listen(".MessageReactionChanged", handleMessageReactionChanged);

    return () => {
      channel.stopListening(".MessageSent", handleMessageSent);
      channel.stopListening(
        ".MessageReactionChanged",
        handleMessageReactionChanged,
      );
      echo.leave(channelName);
    };
  }, [conversationId, dispatch]);

  const handleViewFile = (url: string) => {
    scrollToBottom();
    window.open(url, "_blank");
  };

  const handleReactMessage = async (messageId: number, emoji: string) => {
    try {
      await reactForeMessage({ messageId, data: { reaction: emoji } }).unwrap();
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
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const handleSendMessage = async () => {
    if (!conversationId) return;
    if (recordingBlob) {
      await sendRecording();
      return;
    }

    const content = inputValue.trim();
    if (!content && !attachments) return;

    const formData = new FormData();
    formData.append("type", attachments ? "file" : "text");
    formData.append("message", content);
    if (attachments) formData.append("file", attachments);

    try {
      await sendMessage({ conversationId, data: formData }).unwrap();
      setInputValue("");
      setAttachments(null);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div>
      <div className="h-full bg-white">
        <div className="border md:ml-4 rounded-2xl w-full flex flex-col">
          <div className="flex p-3! md:p-4! w-full items-center justify-between">
            <div className="flex items-center gap-2! md:gap-3!">
              <div className="w-10 h-10 overflow-hidden rounded-sm">
                <Image
                  src={
                    conversationList?.other_user?.profile_image_url ||
                    emptyImage
                  }
                  width={40}
                  height={40}
                  className="rounded-sm w-full h-full object-center object-cover"
                  alt=""
                />
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-lg text-headerColor">
                  {conversationList?.other_user?.name}
                </p>
                <p className="text-xs text-descriptionColor!">
                  {conversationList?.other_user?.title || "No title"}
                </p>
              </div>
            </div>
            <button className="cursor-pointer text-secondaryColor!">
              <BsThreeDotsVertical className="text-blackColor" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="md:h-135 h-100 border-t overflow-y-auto p-3! md:p-4! space-y-3.5">
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
                      <div className="flex items-center gap-0.5 absolute bg-white px-1.5 py-0.5 rounded-full shadow-md border border-gray-100 -bottom-3 -right-2 z-10">
                        {msg.reactions.map((react: any, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs flex items-center gap-0.5"
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
                        <div className="flex items-center gap-1 absolute rounded-full shadow-md bg-white text-black border border-gray-100 -bottom-3 -left-2 z-10">
                          {msg.reactions.map((react: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 text-xs flex items-center gap-0.5"
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
            <div ref={messagesEndRef} />
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
            <div className="flex items-start gap-1 md:gap-3">
              {/* File Attachment Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer p-1"
              >
                <AttatchIcon className="w-4.5 h-4.5" />
              </button>
              {/* Voice Record / Discard Section */}
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
              {/* Emoji Picker */}
              <SmartEmojiPicker
                onEmojiSelect={handleEmojiSelect}
                iconClassName="w-5 h-5 text-descriptionColor cursor-pointer hover:opacity-80"
                height={250}
              />
              {/* Input Field */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write message here..."
                className="w-full resize-none bg-transparent text-[16px] leading-6 text-headerColor placeholder:text-grayColor1 focus:outline-none transition-all"
              />
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage}
                className="bg-primaryColor text-white px-3 py-3 rounded-sm cursor-pointer disabled:opacity-50"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageRoot;
