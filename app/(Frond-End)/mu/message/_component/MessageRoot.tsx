"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import {
  useGetConversationListQuery,
  useGetConversationMessagesQuery,
  useReactForeMessageMutation,
  useSendMessageMutation,
} from "@/feature/slice/message/messageSlice";
import echo from "@/lib/echo";
import emptyImage from "@/public/empty_user.jpg";
import { AttatchIcon, SendIcon, VoiceIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { BsEmojiFrown, BsThreeDotsVertical } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import MessageFileRenderer from "./MessageFileRenderer";
import MessageReactEmojiAction from "./MessageReactEmojiAction";
import MessageUserSection from "./MessageUserSection";

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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    return () => {
      if (recorderTimerRef.current) clearInterval(recorderTimerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

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
      console.log("first", data);
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

  const handleSendMessage = async () => {
    const content = inputValue.trim();
    if (!content && !attachments) return;
    if (selectedId === null) return;
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

  const sendAudioBlob = async (blob: Blob) => {
    if (selectedId === null) return;
    const mime = blob.type || "audio/webm";
    const ext = mime.includes("mp3")
      ? "m4a"
      : mime.includes("aac")
        ? "aac"
        : "webm";
    const formData = new FormData();
    formData.append("type", "voice");
    formData.append("message", "");
    formData.append("file", blob, `voice-message.${ext}`);
    try {
      await sendMessage({
        conversationId: selectedId,
        data: formData,
      }).unwrap();
    } catch (error) {
      console.error("Failed to send voice message", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const preferredMimes = [
        "audio/mp3",
        "audio/m4a",
      ];
      const mimeType =
        typeof MediaRecorder.isTypeSupported === "function"
          ? preferredMimes.find((m) => MediaRecorder.isTypeSupported(m))
          : undefined;
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (blob.size > 0) sendAudioBlob(blob);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recorderTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start voice recording", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (recorderTimerRef.current) {
      clearInterval(recorderTimerRef.current);
      recorderTimerRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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
          {/* Sidebar */}
          <div className="lg:max-w-90 max-w-80 hidden md:border-r pr-4 w-full  md:flex flex-col">
            <MessageUserSection
              chatMessages={data?.data || []}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              user={"client"}
            />
          </div>

          {/* Chat Section */}
          <div className=" border md:ml-4 rounded-2xl w-full flex flex-col">
            {/* Header */}
            {chatMessages.length > 0 ? (
              <>
                <div className="flex p-3! md:p-4!  w-full items-center justify-between">
                  <div className=" flex items-center gap-2! md:gap-3!">
                    <button
                      className="md:hidden  rounded-sm"
                      onClick={() => setSiderOpen((prev) => !prev)}
                    >
                      <FaBars />
                    </button>
                    <Image
                      src={
                        conversationList?.other_user?.profile_image_url ||
                        emptyImage
                      }
                      width={40}
                      height={40}
                      className="rounded-sm"
                      alt=""
                    />
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

                {/* Messages */}
                <div className="md:h-135 h-100 border-t overflow-y-auto p-3! md:p-6! space-y-4">
                  {chatMessages?.map((msg) =>
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
                        <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
                          <MessageReactEmojiAction
                            onReact={handleReactMessage}
                            type="receiver"
                            id={msg.id}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        key={msg.id}
                        className="max-w-xs group/message ml-auto"
                      >
                        <div className="flex items-center justify-end w-full   gap-2">
                          <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
                            <MessageReactEmojiAction
                              onReact={handleReactMessage}
                              type="sender"
                              id={msg.id}
                            />
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
                                {msg.reactions.map(
                                  (react: any, idx: number) => (
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
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
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
