"use client";

import Search from "@/components/reusable/Search";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  useArchiveMessageMutation,
  useDeleteConversationMutation,
  useGetConversationListQuery,
  useMarkReadMessageMutation,
  useMarkUnReadMessageMutation,
  useUnarchiveMessageMutation,
} from "@/feature/slice/message/messageSlice";
import { truncateText } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import { VerifyBadgeIcon } from "@/public/svgIcons/Icons";
import dayjs from "dayjs";
import { Archive, ArchiveRestore, Check, Trash2 } from "lucide-react";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { IoMdDoneAll } from "react-icons/io";
function MessageUserSection() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "all";
  const { data } = useGetConversationListQuery(activeTab, {
    skip: activeTab === null,
  });
  const [markReadMessage] = useMarkReadMessageMutation();
  const [markUnReadMessage] = useMarkUnReadMessageMutation();
  const [archiveMessage] = useArchiveMessageMutation();
  const [unarchiveMessage] = useUnarchiveMessageMutation();
  const [deleteConversation] = useDeleteConversationMutation();
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
      id: 3,
      name: "unread",
    },
    {
      id: 2,
      name: "recruiter",
    },
    {
      id: 4,
      name: "archived",
    },
  ];

  const handleReadMessage = async (messageId: number) => {
    router.push(`/mu/message/${messageId}`);
    try {
      await markReadMessage(messageId).unwrap();
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleToggleRead = async (msg: any) => {
    try {
      if (msg.unread_count > 0) {
        await markReadMessage(msg.id).unwrap();
      } else {
        await markUnReadMessage(msg.id).unwrap();
      }
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  const handleToggleArchive = async (msg: any) => {
    try {
      if (msg.is_archived) {
        await unarchiveMessage(msg.id).unwrap();
      } else {
        await archiveMessage(msg.id).unwrap();
      }
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const handleDeleteConversation = async (msg: any) => {
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      try {
        await deleteConversation(msg.id).unwrap();
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
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
        <div className="md:h-135 h-120 border-t overflow-y-auto">
          {/* User */}
          {data?.data?.length > 0 ? (
            data?.data?.map((msg: any, index: number) => {
              return (
                <ContextMenu key={msg.id}>
                  <ContextMenuTrigger asChild>
                    <div
                      onClick={() => handleReadMessage(msg.id)}
                      className={`p-2 flex items-center cursor-pointer gap-3 text-left hover:bg-gray-50 transition-colors ${
                        Number(params?.id) === msg.id ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="w-10 h-10 overflow-hidden rounded-sm">
                        <Image
                          src={msg?.user?.profile_image_url || emptyImage}
                          width={40}
                          height={40}
                          className="rounded-sm w-full h-full object-center object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex gap-1.5 items-center">
                            <p className="font-medium text-sm ">
                              {msg?.user?.name}{" "}
                            </p>
                            {msg?.user?.has_premium && (
                              <VerifyBadgeIcon className="w-3.5 h-3.5 text-primaryColor" />
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {dayjs(msg?.last_message?.created_at).fromNow()}
                          </span>
                        </div>
                        <p className="text-xs flex justify-between text-gray-500 truncate">
                          {msg.last_message?.message
                            ? truncateText(msg.last_message?.message, 30)
                            : msg.last_message?.type === "audio"
                              ? "Send an voice"
                              : msg.last_message?.type === "file"
                                ? "Send a file"
                                : msg.last_message?.type === "vedio"
                                  ? "Send a video"
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
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem className="cursor-pointer flex items-center gap-2">
                      <button
                        onClick={() => handleToggleArchive(msg)}
                        className="flex items-center gap-2"
                      >
                        {msg?.is_archived ? (
                          <>
                            <ArchiveRestore className="w-4 h-4 text-gray-600" />
                            <span>Unarchive Chat</span>
                          </>
                        ) : (
                          <>
                            <Archive className="w-4 h-4 text-gray-600" />
                            <span>Archive Chat</span>
                          </>
                        )}
                      </button>
                    </ContextMenuItem>
                    <ContextMenuItem className="cursor-pointer flex items-center gap-2">
                      <button
                        onClick={() => handleToggleRead(msg)}
                        className="flex items-center gap-2"
                      >
                        {msg?.unread_count > 0 ? (
                          <>
                            <Check className="w-4 h-4 text-gray-600" />
                            <span>Mark as Read</span>
                          </>
                        ) : (
                          <>
                            <IoMdDoneAll className="w-4 h-4 text-gray-600" />
                            <span>Mark as Unread</span>
                          </>
                        )}
                      </button>
                    </ContextMenuItem>
                    <ContextMenuItem className="cursor-pointer flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteConversation(msg)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">Delete Chat</span>
                      </button>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              No messages found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageUserSection;
