"use client";

import emptyImage from "@/public/empty_user.jpg";
import { VerifyBadgeIcon } from "@/public/svgIcons/Icons";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IndustryChatHeaderProps {
  user?: any;
  industry?: any;
  mode?: "industry" | "user";
}

function IndustryChatHeader({ user, industry, mode = "industry" }: IndustryChatHeaderProps) {
  const router = useRouter();

  const isIndustryView = mode === "industry";
  const displayName = isIndustryView ? user?.name : industry?.name;
  const displayImage = isIndustryView ? user?.profile_image_url : industry?.logo;
  const displaySubtitle = isIndustryView ? (user?.title || "MindUnite Member") : (industry?.tagline || industry?.industry || "Company");
  const hasPremium = isIndustryView ? user?.has_premium : false;
  const profileHref = isIndustryView ? (user?.id ? `/mu/profile/${user.id}` : "#") : `/mu/industry/${industry?.id}`;

  return (
    <div className="flex p-3 md:p-4 w-full items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/mu/industry-message")}
          className="md:hidden p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0 border border-gray-200">
          <Image
            src={displayImage || emptyImage}
            width={40}
            height={40}
            className="h-full w-full object-cover"
            alt={displayName || "Participant"}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-base text-headerColor truncate">
              {displayName}
            </h4>
            {hasPremium && (
              <VerifyBadgeIcon className="w-3.5 h-3.5 text-primaryColor shrink-0" />
            )}
          </div>
          <p className="text-xs text-descriptionColor truncate">
            {displaySubtitle}
          </p>
        </div>
      </div>

      {profileHref !== "#" && (
        <Link
          href={profileHref}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs text-primaryColor hover:underline font-medium px-2.5 py-1.5 rounded-md hover:bg-primaryColor/10 transition"
        >
          <span>{isIndustryView ? "View Profile" : "View Industry"}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

export default IndustryChatHeader;

