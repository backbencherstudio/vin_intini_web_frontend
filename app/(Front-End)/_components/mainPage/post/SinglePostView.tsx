"use client";

import PostCardSkleton from "./PostCardSkleton";
import { useGetSinglePostQuery } from "@/feature/slice/post/postSlice";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PostCard from "./PostCard";

export default function SinglePostView({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetSinglePostQuery(id);
  const post = data?.data || data?.post || data;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2">
          <Link
            href="/mu/home"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-descriptionColor hover:text-primaryColor transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to feed
          </Link>
        </div>
        <PostCardSkleton />
      </div>
    );
  }

  if (isError || !post?.id) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2">
          <Link
            href="/mu/home"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-descriptionColor hover:text-primaryColor transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to feed
          </Link>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-xs">
          <h3 className="text-lg font-bold text-headerColor">
            Post not found
          </h3>
          <p className="mt-1 text-sm text-descriptionColor">
            This post may have been deleted by the author or is no longer accessible.
          </p>
          <div className="mt-4">
            <Link
              href="/mu/home"
              className="inline-block rounded-full bg-primaryColor px-5 py-2 text-sm font-semibold text-white hover:bg-primaryColor/90 transition-colors"
            >
              Go to Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-1">
        <Link
          href="/mu/home"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-descriptionColor hover:text-primaryColor transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </Link>
      </div>

      <PostCard post={post} priority={true} />
    </div>
  );
}
