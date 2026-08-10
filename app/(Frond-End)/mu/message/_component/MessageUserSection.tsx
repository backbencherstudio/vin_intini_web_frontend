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

  return (
    <div>
      <div className="w-full h-full  flex flex-col">
        <div className="p-4 ">
          <Search placeHolder="Search messages..." />
        </div>

        <div className="flex px-4 gap-6 border-b text-base font-medium text-blackColor">
          <button
            onClick={() => setTab("admin")}
            className={`py-2 px-2 border-b-2 cursor-pointer ${activeTab === "admin" ? " border-black font-medium" : "text-gray-500 border-white"}`}
          >
            Admin
          </button>
          <button
            onClick={() => setTab("user")}
            className={`py-2 px-2 border-b-2 cursor-pointer capitalize ${activeTab === "user" ? " border-black font-medium" : "text-gray-500 border-white"}`}
          >
            {user}(2)
          </button>
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
