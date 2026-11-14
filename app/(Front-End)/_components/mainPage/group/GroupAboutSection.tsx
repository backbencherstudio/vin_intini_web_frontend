"use client";

import Error from "@/components/reusable/Error";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetViewByIdGroupQuery } from "@/feature/slice/group/groupSlice";
import proImage from "@/public/empty_user.jpg";
import {
  Calendar,
  Globe,
  Info,
  Lock,
  MapPin,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface GroupAboutSectionProps {
  groupId: string;
}

export default function GroupAboutSection({ groupId }: GroupAboutSectionProps) {
  const { data, isLoading, isError } = useGetViewByIdGroupQuery({
    id: groupId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-borderColor bg-white p-5 space-y-3">
          <Skeleton className="h-6 w-44 bg-gray-200" />
          <Skeleton className="h-4 w-full bg-gray-200" />
          <Skeleton className="h-4 w-[85%] bg-gray-200" />
          <Skeleton className="h-4 w-[60%] bg-gray-200" />
        </div>
        <div className="rounded-xl border border-borderColor bg-white p-5 space-y-3">
          <Skeleton className="h-6 w-36 bg-gray-200" />
          <Skeleton className="h-16 w-full rounded-md bg-gray-200" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <Error />;
  }

  const groupData = data?.data?.group;
  const isPrivate = groupData?.type === "private";

  // Parse industry tags safely
  let industries: string[] = [];
  if (Array.isArray(groupData?.industry)) {
    industries = groupData.industry;
  } else if (typeof groupData?.industry === "string") {
    try {
      if (groupData.industry.startsWith("[")) {
        industries = JSON.parse(groupData.industry);
      } else {
        industries = groupData.industry.split(",").map((s: string) => s.trim()).filter(Boolean);
      }
    } catch {
      industries = [groupData.industry];
    }
  }

  // Format created date
  const createdDate = groupData?.created_at
    ? new Date(groupData.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const creatorName = groupData?.creator
    ? `${groupData.creator.first_name || ""} ${groupData.creator.last_name || ""}`.trim()
    : null;

  return (
    <div className="space-y-5">
      {/* 1. Description Card */}
      <div className="rounded-xl border border-borderColor bg-white p-5 md:p-6 shadow-2xs">
        <h3 className="text-lg font-bold text-headerColor flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-primaryColor" />
          <span>About this group</span>
        </h3>
        <p className="text-sm md:text-base text-descriptionColor leading-relaxed whitespace-pre-line">
          {groupData?.description || "No description provided for this group."}
        </p>

        {/* Industry Tags */}
        {industries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-borderColor/60">
            <h4 className="text-xs font-semibold text-grayColor1 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Industries & Topics</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f0f9fa] text-primaryColor border border-[#d0f0f3]"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Rules & Guidelines Card */}
      <div className="rounded-xl border border-borderColor bg-white p-5 md:p-6 shadow-2xs">
        <h3 className="text-lg font-bold text-headerColor flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-primaryColor" />
          <span>Group Rules & Guidelines</span>
        </h3>
        {groupData?.rules ? (
          <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-4 text-sm md:text-base text-headerColor/90 leading-relaxed whitespace-pre-line">
            {groupData.rules}
          </div>
        ) : (
          <p className="text-sm text-descriptionColor italic">
            No specific rules have been posted for this group yet. Members are expected to follow general community guidelines.
          </p>
        )}
      </div>

      {/* 3. Group Overview / Details Card */}
      <div className="rounded-xl border border-borderColor bg-white p-5 md:p-6 shadow-2xs">
        <h3 className="text-lg font-bold text-headerColor mb-4">Group Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Privacy */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-bgLightColor border border-borderColor/50">
            <div className="p-2 rounded-md bg-white border border-borderColor/60 text-primaryColor shrink-0">
              {isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-grayColor1 uppercase tracking-wider">Privacy</p>
              <p className="text-sm font-semibold text-headerColor mt-0.5">
                {isPrivate ? "Private Group" : "Public Group"}
              </p>
              <p className="text-xs text-descriptionColor mt-1 leading-normal">
                {isPrivate
                  ? "Only members can see posts and discussions. Joining is by invitation."
                  : "Anyone can see posts and discussions in this group."}
              </p>
            </div>
          </div>

          {/* Members */}
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-bgLightColor border border-borderColor/50">
            <div className="p-2 rounded-md bg-white border border-borderColor/60 text-primaryColor shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-grayColor1 uppercase tracking-wider">Members</p>
              <p className="text-sm font-semibold text-headerColor mt-0.5">
                {groupData?.members_count || 0} total members
              </p>
              <p className="text-xs text-descriptionColor mt-1 leading-normal">
                Active community members
              </p>
            </div>
          </div>

          {/* Location */}
          {groupData?.location && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-bgLightColor border border-borderColor/50">
              <div className="p-2 rounded-md bg-white border border-borderColor/60 text-primaryColor shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-grayColor1 uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-headerColor mt-0.5">
                  {groupData.location}
                </p>
              </div>
            </div>
          )}

          {/* Created Date */}
          {createdDate && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-bgLightColor border border-borderColor/50">
              <div className="p-2 rounded-md bg-white border border-borderColor/60 text-primaryColor shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-grayColor1 uppercase tracking-wider">Created</p>
                <p className="text-sm font-semibold text-headerColor mt-0.5">
                  {createdDate}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Group Creator / Admin Card */}
      {groupData?.creator && (
        <div className="rounded-xl border border-borderColor bg-white p-5 md:p-6 shadow-2xs">
          <h3 className="text-lg font-bold text-headerColor mb-3">Group Admin</h3>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200">
              <Image
                src={groupData.creator.profile_image_url || proImage}
                alt={creatorName || "Admin"}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-headerColor truncate">
                {creatorName || "Admin"}
              </h4>
              <p className="text-xs md:text-sm text-descriptionColor truncate">
                {groupData.creator.title || "Group Administrator"}
              </p>
            </div>
            {groupData.creator.username && (
              <Link
                href={`/mu/profile/${groupData.creator.username}`}
                className="shrink-0 text-xs md:text-sm font-semibold text-primaryColor hover:underline px-3 py-1.5 rounded-full border border-primaryColor/30 hover:bg-primaryColor/5 transition-colors"
              >
                View Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

