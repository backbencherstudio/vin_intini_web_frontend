"use client";

import { ConnectionRequestType } from "@/lib/type";
import emptyImage from "@/public/empty_user.jpg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const rawUserImage =
    user?.profile_image_url || user?.profile?.profile_image_url || "";
  const userTitle = user?.title || user?.profile?.title || "";
  const username = user?.username || user?.id || "";

  const mutualList = item?.mutual_connections || [];
  const mutualCount = item?.mutual_connections_count || 0;
  const firstMutual = mutualList[0];
  const rawMutualImage = firstMutual?.profile_image_url || "";

  const [imgSrc, setImgSrc] = useState<any>(rawUserImage || emptyImage);
  const [mutualImgSrc, setMutualImgSrc] = useState<any>(
    rawMutualImage || emptyImage,
  );

  useEffect(() => {
    setImgSrc(rawUserImage || emptyImage);
  }, [rawUserImage]);

  useEffect(() => {
    setMutualImgSrc(rawMutualImage || emptyImage);
  }, [rawMutualImage]);

  return (
    <article className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-borderColor/80 py-4 last:border-b-0">
      <div className="flex items-start sm:items-center flex-1 min-w-0 gap-3.5">
        <Link
          href={`/mu/profile/${username}`}
          className="h-14 w-14 sm:h-15 sm:w-15 shrink-0 overflow-hidden rounded-full border border-borderColor/70 bg-bgColor ring-2 ring-white shadow-xs"
        >
          <Image
            src={imgSrc}
            alt={userName}
            width={150}
            height={150}
            unoptimized
            onError={() => setImgSrc(emptyImage)}
            className="h-full w-full object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            href={`/mu/profile/${username}`}
            className="line-clamp-1 text-base sm:text-[17px] font-semibold leading-snug text-headerColor hover:text-primaryColor transition-colors"
          >
            {userName}
          </Link>

          {userTitle && (
            <p className="mt-0.5 line-clamp-1 text-sm leading-snug text-descriptionColor">
              {userTitle}
            </p>
          )}

          {mutualList.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5 min-w-0 text-xs text-grayColor1">
              <Image
                src={mutualImgSrc}
                alt={firstMutual?.name || "Mutual connection"}
                width={24}
                height={24}
                unoptimized
                onError={() => setMutualImgSrc(emptyImage)}
                className="h-4.5 w-4.5 shrink-0 rounded-full object-cover border border-borderColor/50"
              />
              <span className="truncate">
                <Link
                  href={`/mu/profile/${firstMutual?.username}`}
                  className="font-medium text-headerColor/85 hover:underline"
                >
                  {firstMutual?.name}
                </Link>
                {mutualCount > 1
                  ? ` and ${mutualCount - 1} other${mutualCount - 1 > 1 ? "s" : ""} mutual connections`
                  : " is a mutual connection"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row sm:flex-col w-full sm:w-auto items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
        {item?.status === "accepted" && item?.connected_since ? (
          <span className="order-1 sm:order-2 text-[11px] font-medium text-grayColor1 whitespace-nowrap">
            Connected since {item.connected_since}
          </span>
        ) : isSent && item?.sent_since ? (
          <span className="order-1 sm:order-2 text-[11px] font-medium text-grayColor1 whitespace-nowrap">
            Sent on {item.sent_since}
          </span>
        ) : item?.sent_since ? (
          <span className="order-1 sm:order-2 text-[11px] font-medium text-grayColor1 whitespace-nowrap">
            Requested on {item.sent_since}
          </span>
        ) : (
          <span className="sm:hidden" />
        )}
        <div className="order-2 sm:order-1">
          <ConnectionActionButtons
            id={item?.id || (item as any)?.pending_request_id}
            userId={user?.id}
            status={isSent ? "sent" : item?.status}
            isFollower={item?.is_following_back}
            isfollowedBack={item?.is_followed_back}
          />
        </div>
      </div>
    </article>
  );
}

export default ConnectionRequestCard;
