import { ConnectionRequestType } from "@/lib/type";
import emptyImage from "@/public/empty_user.jpg";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ConnectionActionButtons } from "./ConnectionActionButtons";
function ConnectionRequestCard({
  item,
  isSent = false,
}: {
  item: ConnectionRequestType;
  isSent?: boolean;
}) {
  const user = item?.user || (item as any)?.receiver;
  const userName =
    user?.name ||
    (user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : "Member");
  const userImage =
    user?.profile_image_url || user?.profile?.profile_image_url || emptyImage;
  const userTitle = user?.title || user?.profile?.title || "";
  const username = user?.username || user?.id || "";

  return (
    <div>
      <article className="flex flex-col md:flex-row lg:gap-6 xl:gap-8 items-start justify-between gap-3 border-b border-borderColor py-3">
        <div className="flex h-full items-start flex-1 gap-3 ">
          <div className="flex md:h-16 md:w-16  w-12 h-12 items-center justify-center overflow-hidden rounded-full bg-bgColor">
            {item.id === 1 ? (
              <ImageIcon className="h-4 w-4 text-descriptionColor" />
            ) : (
              <Image
                src={userImage}
                alt={userName}
                width={150}
                height={150}
                unoptimized
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1">
            <Link
              href={`/mu/profile/${username}`}
              className=" text-[18px] text-headerColor font-semibold hover:text-primaryColor transition-colors"
            >
              {userName}
            </Link>
            {userTitle && (
              <p className=" text-[14px] text-descriptionColor">{userTitle}</p>
            )}
            <div
              className={`flex ${item?.mutual_connections?.length > 0 ? "justify-between" : "justify-end"}  gap-3 items-center`}
            >
              {item?.mutual_connections?.length > 0 ? (
                <div className="mt-1 flex  items-center gap-1 text-[12px] text-grayColor1">
                  <Image
                    src={
                      item?.mutual_connections[0]?.profile_image_url ||
                      emptyImage
                    }
                    alt="mutual"
                    width={24}
                    height={24}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  <span className="">
                    <Link
                      href={`/mu/profile/${item?.mutual_connections[0]?.username}`}
                      className="text-headerColor hover:underline"
                    >
                      {item?.mutual_connections[0]?.name}
                    </Link>{" "}
                    {item?.mutual_connections_count > 1 &&
                      "and " + item?.mutual_connections_count + " others "}{" "}
                    mutual connections
                  </span>
                </div>
              ) : null}
              <div className="">
                {item?.status === "accepted" && (
                  <span className="text-[12px] leading-3 text-grayColor1 font-semibold">
                    {item?.connected_since}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full md:w-fit justify-end items-center">
          <ConnectionActionButtons
            id={item?.id}
            userId={user?.id}
            status={isSent ? "sent" : item?.status}
            isFollower={item?.is_following_back}
            isfollowedBack={item?.is_followed_back}
          />
        </div>
      </article>
    </div>
  );
}

export default ConnectionRequestCard;
