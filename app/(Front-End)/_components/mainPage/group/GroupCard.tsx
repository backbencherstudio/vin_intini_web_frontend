"use client";

import { BUTTON_STYLES } from "@/components/reusable/buttonStyles";
import { GroupDetailType } from "@/lib/type";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function GroupCard({ group }: { group: GroupDetailType }) {
  const [imgError, setImgError] = useState(false);
  const groupHref = `/mu/my-network/group/${group.id}`;

  return (
    <div className="border-b border-borderColor py-4 first:pt-5 last:border-b-0">
      <div className="flex items-start gap-3">
        <Link
          href={groupHref}
          aria-label={`View ${group.name}`}
          className="flex xl:h-18 xl:w-18 w-12 h-12 lg:w-14 lg:h-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-bgColor text-[#70757f] transition-opacity hover:opacity-90"
        >
          {!group.logo_url || imgError ? (
            <ImageIcon size={28} strokeWidth={1.8} />
          ) : (
            <Image
              src={group.logo_url}
              alt={group.name || "Group logo"}
              width={72}
              height={72}
              unoptimized
              onError={() => setImgError(true)}
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={groupHref}
            className="block truncate text-base md:text-lg leading-[150%] font-semibold text-headerColor hover:text-primaryColor hover:underline transition-colors"
          >
            {group.name}
          </Link>

          <div className="mt-1.5 flex items-center gap-2 text-grayColor1">
            <GroupUserIcon />
            <span className="text-[13px] leading-5">
              {group?.members_count || group?.total_member || 0} Group members
            </span>
          </div>
        </div>
        <Link
          href={groupHref}
          className={`${BUTTON_STYLES.borderBtn} mt-4 shrink-0`}
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default GroupCard;
