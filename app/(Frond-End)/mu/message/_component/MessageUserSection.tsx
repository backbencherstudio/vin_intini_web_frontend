"use client";

import Search from "@/components/reusable/Search";
import { useMarkReadMessageMutation } from "@/feature/slice/message/messageSlice";
import { truncateText } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import dayjs from "dayjs";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoMdDoneAll } from "react-icons/io";
function MessageUserSection({
  user,
  chatMessages,
  setSelectedId,
  selectedId,
}: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "admin";
  const [markReadMessage] = useMarkReadMessageMutation();
  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };
  const messageType = [
    {
      id: 1,
      name: "all",
    },
    {
      id: 2,
      name: "recruiter",
    },
    {
      id: 3,
      name: "unread",
    },
    {
      id: 4,
      name: "archived",
    },
  ];

  const handleReadMessage = async (messageId: number) => {
    setSelectedId(messageId);
    try {
      await markReadMessage(messageId).unwrap();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <div>
      <div className="w-full h-full  flex flex-col">
        <div className="pb-4 ">
          <Search
            placeHolder="Search messages..."
            className="rounded-sm! py-3!"
          />
        </div>

        <div className="flex  gap-2 overflow-x-auto mb-3 justify-between  text-base font-medium text-blackColor">
          {messageType.map((item) => (
            <button
              onClick={() => setTab(item.name)}
              className={`py-1 rounded-sm px-4 border capitalize  text-sm border-liteDescriptionColor/80 text-liteDescriptionColor  cursor-pointer ${activeTab === item?.name ? " bg-primaryColor text-whiteColor border-0 font-medium" : " "}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* User */}
        {chatMessages?.length > 0 ? (
          chatMessages.map((msg: any, index: number) => (
            <div
              onClick={() => handleReadMessage(msg.id)}
              className={`p-4 flex items-center cursor-pointer gap-3 text-left hover:bg-gray-50 transition-colors ${
                selectedId === msg.id ? "bg-gray-100" : ""
              }`}
            >
              <Image
                src={msg?.user?.profile_image_url || emptyImage}
                width={40}
                height={40}
                className="rounded-sm"
                alt=""
              />
              <div className="flex-1">
                <p className="font-medium text-sm flex justify-between">
                  {msg?.user?.name}{" "}
                  <span className="text-xs text-gray-400">
                    {dayjs(msg?.last_message?.created_at).fromNow()}
                  </span>
                </p>
                <p className="text-xs flex justify-between text-gray-500 truncate">
                  {msg.last_message?.message
                    ? truncateText(msg.last_message?.message, 30)
                    : msg.last_message?.file_url
                      ? "Send a photo"
                      : "No message available"}
                  {msg?.unread_count > 0 ? (
                    <span className="bg-redColor inline text-white text-xs  px-2 rounded-full">
                      {msg?.unread_count}
                    </span>
                  ) : (
                    <IoMdDoneAll className="text-primaryColor" />
                  )}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageUserSection;
