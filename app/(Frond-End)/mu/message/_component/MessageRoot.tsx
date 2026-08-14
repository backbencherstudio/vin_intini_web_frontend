"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import {
  useGetConversationListQuery,
  useGetConversationMessagesQuery,
  useReactForeMessageMutation,
  useSendMessageMutation,
} from "@/feature/slice/message/messageSlice";
import echo from "@/lib/echo";
import { AttatchIcon, SendIcon, VoiceIcon } from "@/public/svgIcons/Icons";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { BsEmojiFrown } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageUserSection from "./MessageUserSection";
import { useVoiceRecorder } from "./useVoiceRecorder";

function MessageRoot() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "admin";
  const { data } = useGetConversationListQuery(activeTab, {
    skip: activeTab === null,
  });
  const [selectedId, setSelectedId] = useState<number | null>(
    data?.data?.[0]?.id || null,
  );
  const { data: conversationList } = useGetConversationMessagesQuery(
    selectedId,
    {
      skip: selectedId === null,
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => scrollToBottom());
    return () => cancelAnimationFrame(id);
  }, [selectedId, chatMessages?.length]);

  useEffect(() => {
    setChatMessages(conversationList?.data || []);
  }, [selectedId, conversationList]);

  useEffect(() => {
    if (!echo || selectedId === null) return;
    const channelName = `conversation.${selectedId}`;
    const channel = echo.private(channelName);

    const handleMessageSent = (data: any) => {
      const newMsg = data?.message?.id ? data.message : data;
      setChatMessages((prevMessages) => {
        if (!newMsg?.id) return prevMessages;
        const exists = prevMessages.some((m) => m.id === newMsg.id);
        if (exists) return prevMessages;
        return [...prevMessages, newMsg];
      });
    };

    const handleMessageReactionChanged = (data: any) => {
      const messageId = data?.message_id;
      const reactions = data?.reactions;
      if (!messageId || !reactions) return;
      setChatMessages((prevMessages) =>
        prevMessages.map((m) => (m.id === messageId ? { ...m, reactions } : m)),
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
  }, [selectedId, dispatch]);

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

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachments(file);
    e.target.value = "";
  };
  const handleUserSelect = (id) => {
    setSelectedId(id);
    setSiderOpen(false);
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

  const sendAudioBlob = async (blob: Blob) => {
    if (selectedId === null) return;
    const mime = blob.type || "";
    let ext = "";
    if (mime.includes("mp3")) ext = "mp3";
    else if (mime.includes("mp4") || mime.includes("m4a")) ext = "m4a";
    else return;
    const uploadBlob = new Blob([blob], {
      type: ext === "mp3" ? "audio/mp3" : "audio/m4a",
    });
    const formData = new FormData();
    formData.append("type", "voice");
    formData.append("message", "");
    formData.append("file", uploadBlob, `voice-message.${ext}`);
    try {
      await sendMessage({
        conversationId: selectedId,
        data: formData,
      }).unwrap();
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
  } = useVoiceRecorder(sendAudioBlob);

  const handleSendMessage = async () => {
    if (selectedId === null) return;
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
      await sendMessage({
        conversationId: selectedId,
        data: formData,
      }).unwrap();
      setInputValue("");
      setAttachments(null);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div>
      <div>
        <div className="relative">
          <div
            className={`fixed z-99 top-0 left-0 h-full  bg-black/50 w-full backdrop-blur-sm border md:hidden transition-transform duration-400 ${sidarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className={` h-full  bg-white w-75  border  md:hidden  `}>
              <div className=" w-full pt-3! flex items-center justify-between px-4">
                <h4 className="text-lg font-medium">Messages</h4>
                <button
                  onClick={() => setSiderOpen(false)}
                  className=" bg-gray-200 p-1.5 rounded-full"
                >
                  <IoClose className="text-base" />
                </button>
              </div>
              <div className="pt-2! p-2">
                <MessageUserSection
                  chatMessages={data?.data || []}
                  setSelectedId={handleUserSelect}
                  selectedId={selectedId}
                  user={"client"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-full bg-white flex ">
          <div className="lg:max-w-90 max-w-80 hidden md:border-r pr-4 w-full  md:flex flex-col">
            <MessageUserSection
              chatMessages={data?.data || []}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              user={"client"}
            />
          </div>

          <div className=" border md:ml-4 rounded-2xl w-full flex flex-col">
            {chatMessages.length > 0 ? (
              <>
                <ChatHeader
                  otherUser={conversationList?.other_user}
                  onToggleSidebar={() => setSiderOpen((prev) => !prev)}
                />

                <div className="md:h-135 h-100 border-t overflow-y-auto p-3! md:p-6! space-y-4">
                  {chatMessages?.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      msg={msg}
                      onViewFile={handleViewFile}
                      onReact={handleReactMessage}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

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
                    <button
                      onClick={handleAttachClick}
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
                      onChange={(e) => setInputValue(e?.target?.value)}
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
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center p-4 md:p-6 items-center">
                <div className="flex md:hidden  rounded-sm  justify-between w-full items-center mb-4">
                  <button
                    className=""
                    onClick={() => setSiderOpen((prev) => !prev)}
                  >
                    <FaBars />
                  </button>
                  <p className="font-semibold">Open Chat</p>
                </div>
                <div className="h-135 flex flex-col px-4 max-w-134.75 w-full items-center justify-center gap-2">
                  <BsEmojiFrown size={24} />
                  <p className="text-center text-headerColor font-semibold">
                    You don’t have any messages at the moment.
                  </p>
                  <p className="text-center text-sm text-grayColor1">
                    No messages found at the moment. Start a conversation to
                    engage with others, ask questions, or share your thoughts.
                    Don’t wait—get the conversation going now and stay
                    connected!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageRoot;