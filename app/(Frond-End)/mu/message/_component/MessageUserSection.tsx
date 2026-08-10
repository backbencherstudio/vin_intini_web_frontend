"use client";

import Search from "@/components/reusable/Search";
import { truncateText } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
      name: "Archived",
    },
  ];

  return (
    <div>
      <div className="w-full h-full  flex flex-col">
        <div className="pb-4 ">
          <Search placeHolder="Search messages..." className="rounded-sm! py-3!" />
        </div>

        <div className="flex  gap-2 overflow-x-auto mb-3 justify-between  text-base font-medium text-blackColor">
          {messageType.map((item) => (
            <button
              onClick={() => setTab(item.name)}
              className={`py-1 rounded-sm px-4 border text-sm border-liteDescriptionColor/80 text-liteDescriptionColor  cursor-pointer ${activeTab === item?.name ? " bg-primaryColor text-whiteColor border-0 font-medium" : " "}`}
            >
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </button>
          ))}
        </div>

        {/* User */}
        {chatMessages?.length > 0 ? (
          chatMessages.map((msg: any, index: number) => (
            <div
              onClick={() => setSelectedId(msg.id)}
              className={`p-4 flex items-center cursor-pointer gap-3 text-left hover:bg-gray-50 transition-colors ${
                selectedId === msg.id ? "bg-gray-100" : ""
              }`}
            >
              <Image
                src={msg.avatar}
                width={40}
                height={40}
                className="rounded-full"
                alt=""
              />
              <div className="flex-1">
                <p className="font-medium text-sm flex justify-between">
                  {msg.receiver_user}{" "}
                  <span className="text-xs text-gray-400">2m ago</span>
                </p>
                <p className="text-xs flex justify-between text-gray-500 truncate">
                  {truncateText(
                    msg.message[msg.message.length - 1]?.content,
                    30,
                  )}
                  <span className="bg-redColor inline text-white text-xs  px-2 rounded-full">
                    2
                  </span>
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
