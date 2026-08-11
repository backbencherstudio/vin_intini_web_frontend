"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import {
  useGetConversationListQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
} from "@/feature/slice/message/messageSlice";
import emptyImage from "@/public/empty_user.jpg";
import { AttatchIcon, SendIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import MessageReactEmojiAction from "./MessageReactEmojiAction";
import MessageUserSection from "./MessageUserSection";

function MessageRoot() {
  const { data } = useGetConversationListQuery("conversationList");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: conversationList } = useGetConversationMessagesQuery(
    selectedId,
    {
      skip: selectedId === null,
    },
  );
  const chatMessages = conversationList?.data || [];
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [inputValue, setInputValue] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState({ emoji: "", id: null });
  const [sidarOpen, setSiderOpen] = useState(false);
  const [attachments, setAttachments] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  return (
    <div>
      <div>
        <div className="relative">
          <div
            className={`fixed z-50 top-0 left-0 h-full  bg-black/50 w-full backdrop-blur-sm border md:hidden transition-transform duration-400 ${sidarOpen ? "translate-x-0" : "-translate-x-full"}`}
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
              <div className="pt-2!">
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
          <div className="max-w-90 hidden md:border-r pr-4 w-full  md:flex flex-col">
            <MessageUserSection
              chatMessages={data?.data || []}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              user={"client"}
            />
          </div>

          {/* Chat Section */}
          <div className=" border ml-4 rounded-2xl w-full flex flex-col">
            {/* Header */}
            <div className="flex p-3! md:p-4!  w-full items-center justify-between">
              <div className=" flex items-center gap-2! md:gap-3!">
                <button
                  className="md:hidden  rounded-full"
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
                  className="rounded-full"
                  alt=""
                />
                <div>
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
            <div className="h-135 border-t overflow-y-auto p-3! md:p-6! space-y-4">
              {chatMessages?.map((msg) =>
                !msg.is_mine ? (
                  <div
                    key={msg.id}
                    className="flex group/message items-center gap-2"
                  >
                    <div className="max-w-xs relative bg-[#F3F4F6] border border-[#F3F4F6]! p-3 rounded-t-xl rounded-r-xl text-sm">
                      {msg?.message}
                      {msg?.type === "file" &&
                        msg?.file_url &&
                        (/\.(png|jpe?g|gif|webp|svg)$/i.test(
                          msg?.file_name || msg?.file_url,
                        ) ? (
                          <img
                            src={msg?.file_url}
                            alt={msg?.file_name || "attachment"}
                            className="mt-2 max-h-40 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="mt-2 flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-xs">
                            <AttatchIcon className="w-4 h-4" />
                            <span className="truncate">
                              {msg?.file_name || "File"}
                            </span>
                          </div>
                        ))}
                      {selectedEmoji.id === msg.id && (
                        <p className="p-0.5 rounded-full shadow-md absolute -bottom-3 -right-2 bg-whiteColor">
                          {selectedEmoji.emoji}
                        </p>
                      )}
                    </div>
                    <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
                      <MessageReactEmojiAction
                        setSelectedEmoji={setSelectedEmoji}
                        type="receiver"
                        id={msg.id}
                      />
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="max-w-xs group/message ml-auto">
                    <div className="flex items-center justify-end w-full   gap-2">
                      <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
                        <MessageReactEmojiAction
                          setSelectedEmoji={setSelectedEmoji}
                          type="sender"
                          id={msg.id}
                        />
                      </div>
                      <div className="border relative border-primaryColor bg-primaryColor text-whiteColor p-3 rounded-t-xl rounded-l-xl text-sm">
                        {msg?.message}
                        {msg?.type === "file" &&
                          msg?.file_url &&
                          (/\.(png|jpe?g|gif|webp|svg)$/i.test(
                            msg?.file_name || msg?.file_url,
                          ) ? (
                            <img
                              src={msg?.file_url}
                              alt={msg?.file_name || "attachment"}
                              className="mt-2 max-h-40 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="mt-2 flex items-center gap-2 bg-white text-headerColor rounded-lg px-3 py-2 text-xs">
                              <AttatchIcon className="w-4 h-4" />
                              <span className="truncate">
                                {msg?.file_name || "File"}
                              </span>
                            </div>
                          ))}
                        {selectedEmoji.id === msg.id && (
                          <p className="p-0.5  rounded-full shadow-md absolute -bottom-3 -left-2 bg-whiteColor">
                            {selectedEmoji.emoji}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}
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
              <div className="flex items-start gap-3">
                <button onClick={handleAttachClick}>
                  <AttatchIcon className="w-4.5 h-4.5" />
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageRoot;
