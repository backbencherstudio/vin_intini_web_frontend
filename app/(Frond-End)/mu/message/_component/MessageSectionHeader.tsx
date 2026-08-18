import emptyImage from "@/public/empty_user.jpg";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";

function MessageSectionHeader({ conversationList, isOtherUserTyping }: any) {
  return (
    <div>
      <div className="flex p-3! md:p-4! w-full items-center justify-between">
        <div className="flex items-center gap-2! md:gap-3!">
          <Image
            src={conversationList?.other_user?.profile_image_url || emptyImage}
            width={40}
            height={40}
            className="rounded-sm"
            alt=""
          />
          <div className="space-y-0.5">
            <p className="font-semibold text-lg text-headerColor">
              {conversationList?.other_user?.name}
            </p>
            <p className="text-xs">
              {isOtherUserTyping ? (
                <span className="text-primaryColor font-medium animate-pulse">
                  typing...
                </span>
              ) : (
                <span className="text-descriptionColor!">
                  {conversationList?.other_user?.title || "No title"}
                </span>
              )}
            </p>
          </div>
        </div>
        <button className="cursor-pointer text-secondaryColor!">
          <BsThreeDotsVertical className="text-blackColor" />
        </button>
      </div>
    </div>
  );
}

export default MessageSectionHeader;
