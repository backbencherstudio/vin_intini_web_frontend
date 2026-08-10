"use client";

import Image from "next/image";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import { AttatchIcon, SendIcon } from "@/public/svgIcons/Icons";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import MessageReactEmojiAction from "./MessageReactEmojiAction";
import MessageUserSection from "./MessageUserSection";

const chatMessages = [
  {
    id: 1,
    receiver_user: "Utso Sarkar",
    avatar: "https://i.pravatar.cc/40?img=5",
    last_seen: "Last Seen 09:40",
    message: [
      { type: "sender", content: "Hi", id: 1 },
      { type: "receiver", content: "Hello ", id: 2 },
      { type: "sender", content: "How are you?", id: 3 },
      {
        type: "receiver",
        content: "I'm doing well, thank you! How about you?",
        id: 4,
      },
      {
        type: "sender",
        content: "Fames eros urna, felis morbi a est est.",
        id: 5,
      },
      {
        type: "receiver",
        content: "Fames eros urna, felis morbi a est est.",
        id: 6,
      },
    ],
  },
  {
    id: 2,
    receiver_user: "Marilyn George",
    avatar: "https://i.pravatar.cc/40?img=10",
    last_seen: "Last Seen 10:20",
    message: [
      {
        type: "sender",
        content: "Fames eros urna, felis morbi a est est.",
        id: 7,
      },
      {
        type: "receiver",
        content: "Fames eros urna, felis morbi a est est.",
        id: 8,
      },
    ],
  },
];

function MessageRoot() {
  const [selectedId, setSelectedId] = useState(chatMessages[0].id);
  const [inputValue, setInputValue] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState({ emoji: "", id: null });
  const [sidarOpen, setSiderOpen] = useState(false);
  const handleUserSelect = (id) => {
    setSelectedId(id);
    setSiderOpen(false);
  };
  const activeChat = chatMessages.find((c) => c.id === selectedId)!;
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
                  chatMessages={chatMessages}
                  setSelectedId={handleUserSelect}
                  selectedId={selectedId}
                  user={"client"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-full bg-white rounded-2xl border flex ">
          {/* Sidebar */}
          <div className="max-w-75 hidden  w-full  md:flex flex-col">
            <MessageUserSection
              chatMessages={chatMessages}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              user={"client"}
            />
          </div>

          {/* Chat Section */}
          <div className="md:border-l w-full flex flex-col">
            {/* Header */}
            <div className="flex p-3! md:p-4! w-full items-center justify-between">
              <div className=" flex items-center gap-2! md:gap-3!">
                <button
                  className="md:hidden  rounded-full"
                  onClick={() => setSiderOpen((prev) => !prev)}
                >
                  <FaBars />
                </button>
                <Image
                  src={activeChat.avatar}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-lg text-headerColor">
                    {activeChat.receiver_user}
                  </p>
                  <p className="text-xs text-secondaryColor!">
                    {activeChat.last_seen}
                  </p>
                </div>
              </div>
              <button className="cursor-pointer text-secondaryColor!">
                <BsThreeDotsVertical />
              </button>
            </div>

            {/* Messages */}
            <div className="h-135 border-t overflow-y-auto p-3! md:p-6! space-y-4">
              {activeChat.message.map((msg) =>
                msg.type === "sender" ? (
                  <div
                    key={msg.id}
                    className="flex group/message items-center gap-2"
                  >
                    <div className="max-w-xs relative bg-[#F3F4F6] border border-[#F3F4F6]! p-3 rounded-t-xl rounded-r-xl text-sm">
                      {msg.content}
                      {selectedEmoji.id === msg.id && (
                        <p className="p-0.5  rounded-full shadow-md absolute -bottom-3 -right-2 bg-whiteColor">
                          {selectedEmoji.emoji}
                        </p>
                      )}
                    </div>
                    <div className="opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
                      <MessageReactEmojiAction
                        setSelectedEmoji={setSelectedEmoji}
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
                          id={msg.id}
                        />
                      </div>
                      <div className="  border relative border-primaryColor bg-primaryColor text-whiteColor p-3 rounded-t-xl rounded-l-xl text-sm">
                        {msg.content}
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
            <div className="p-3 border-t flex items-start gap-3 mt-auto">
              <button>
                <AttatchIcon />
              </button>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Write message here..."
                className="w-full resize-none bg-transparent text-[16px] leading-6 text-headerColor placeholder:text-grayColor1 focus:outline-none transition-all"
              />
              <button className="bg-primaryColor text-white px-3 py-3 rounded-sm cursor-pointer">
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
