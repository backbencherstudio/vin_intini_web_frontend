"use client";

import RootDialog from "@/components/reusable/RootDialog";
import { PostFeedType } from "@/lib/type";
import { formatContentForDisplay, formatPostDate } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import { CommentIcon, LikeIcon } from "@/public/svgIcons/Icons";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import PostComment from "./PostComment";

type PostImageShowDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  mediaItems: NonNullable<PostFeedType["media"]>;
  activeMediaIndex: number;
  setActiveMediaIndex: (index: number) => void;
  post?: PostFeedType;
  isLiked?: boolean;
  likesCount?: number;
  onToggleLike?: () => void;
};

function PostImageShowDialog({
  open,
  setOpen,
  mediaItems,
  activeMediaIndex,
  setActiveMediaIndex,
  post,
  isLiked = false,
  likesCount = 0,
  onToggleLike,
}: PostImageShowDialogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    if (open) {
      setIsExpanded(false);
      setShowComments(true);
    }
  }, [open, post?.id]);

  const isVideo = (item: any): boolean => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
    const url = item.url || item.file_path || "";
    const type = item.type?.toLowerCase() || "";
    return (
      type === "video" ||
      videoExtensions.some((ext) => url.toLowerCase().includes(ext))
    );
  };

  const goToPreviousMedia = () => {
    setActiveMediaIndex(
      activeMediaIndex === 0 ? mediaItems.length - 1 : activeMediaIndex - 1,
    );
  };

  const goToNextMedia = () => {
    setActiveMediaIndex(
      activeMediaIndex === mediaItems.length - 1 ? 0 : activeMediaIndex + 1,
    );
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isTyping) return;

      if (event.key === "ArrowLeft" && mediaItems.length > 1) {
        goToPreviousMedia();
      }
      if (event.key === "ArrowRight" && mediaItems.length > 1) {
        goToNextMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeMediaIndex, mediaItems.length]);

  if (!mediaItems.length) {
    return null;
  }

  const { user, industry } = post || {};
  const rawDescription = post?.description || (post as any)?.content || "";
  const formattedHtml = formatContentForDisplay(rawDescription);
  const hasLongDescription = rawDescription.length > 180;

  const authorName = industry
    ? industry?.name || "Industry"
    : `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      "MindUnite Member";
  const authorTitle = industry
    ? industry?.tagline || "Industry"
    : user?.title || "";
  const authorHref = industry
    ? `/mu/industry/${industry?.id}`
    : `/mu/profile/${user?.username}`;
  const authorAvatar = industry
    ? industry?.logo || emptyImage
    : user?.profile_image_url || emptyImage;
  const postDate = formatPostDate(
    post?.created_at || new Date().toISOString(),
  );

  const renderAuthorHeader = (extraClass = "") => (
    <div
      className={`flex items-center gap-3 px-4 py-3 pr-12 border-b border-borderColor bg-white shrink-0 ${extraClass}`}
    >
      {industry ? (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-borderColor bg-bgLightColor flex items-center justify-center">
          {industry?.logo ? (
            <Image
              src={industry.logo}
              alt={authorName}
              width={80}
              height={80}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <HiOutlineBuildingOffice2 className="h-5 w-5 text-primaryColor" />
          )}
        </div>
      ) : (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-borderColor bg-whiteColor shadow-xs">
          <Image
            src={authorAvatar}
            alt={authorName}
            width={80}
            height={80}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <Link
          href={authorHref}
          onClick={() => setOpen(false)}
          className="line-clamp-1 text-sm font-semibold text-headerColor hover:text-primaryColor hover:underline"
        >
          {authorName}
        </Link>
        {authorTitle && (
          <p className="line-clamp-1 text-xs text-descriptionColor">
            {authorTitle}
          </p>
        )}
        <p className="text-xs text-grayColor1">{postDate}</p>
      </div>
    </div>
  );

  return (
    <RootDialog
      open={open}
      setOpen={setOpen}
      className="w-[96vw] sm:w-[94vw] sm:max-w-[94vw] lg:max-w-6xl h-[92dvh] lg:h-[85vh] max-h-[850px] border-0 p-0 rounded-xl overflow-hidden bg-white shadow-2xl gap-0"
      ariaLabel="Post media preview"
      ariaDescription="LinkedIn-style post image preview with details and comments"
    >
      <div className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
        {/* Mobile/Tablet Header (keeps built-in X button on crisp white bar) */}
        {post && renderAuthorHeader("flex lg:hidden")}

        {/* Left / Top Theater Media Stage */}
        <div
          className={`relative bg-[#0b0d10] flex items-center justify-center overflow-hidden select-none ${
            post
              ? "h-[40dvh] sm:h-[46dvh] shrink-0 lg:h-full lg:flex-1 lg:min-w-0"
              : "h-[80vh] w-full flex-1"
          }`}
        >
          {mediaItems.length > 1 && (
            <div className="absolute top-3 left-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs border border-white/10">
              {activeMediaIndex + 1} / {mediaItems.length}
            </div>
          )}

          {mediaItems.length > 1 && (
            <button
              type="button"
              onClick={goToPreviousMedia}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white border border-white/15 backdrop-blur-xs transition hover:bg-black/80 cursor-pointer"
              aria-label="Previous media"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div className="relative h-full w-full overflow-hidden">
            <div
              className="flex h-full w-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeMediaIndex * 100}%)` }}
            >
              {mediaItems.map((item, idx) => (
                <div
                  key={item.id ?? `${item.url}-${idx}`}
                  className="relative flex h-full min-w-full items-center justify-center p-2 sm:p-4"
                >
                  {isVideo(item) ? (
                    <video
                      src={item.url || item.file_path}
                      controls
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={item.url || item.file_path || "/post_placeholder.png"}
                      alt="Post image preview"
                      width={1400}
                      height={1000}
                      unoptimized
                      sizes="(max-width: 1024px) 96vw, 65vw"
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {mediaItems.length > 1 && (
            <button
              type="button"
              onClick={goToNextMedia}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white border border-white/15 backdrop-blur-xs transition hover:bg-black/80 cursor-pointer"
              aria-label="Next media"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {mediaItems.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-xs">
              {mediaItems.map((item, index) => (
                <button
                  key={`${item.id ?? index}-dot`}
                  type="button"
                  onClick={() => setActiveMediaIndex(index)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeMediaIndex === index
                      ? "w-5 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right / Bottom LinkedIn-style Post Details & Comments Panel */}
        {post && (
          <div className="flex flex-col flex-1 min-h-0 lg:flex-none lg:w-[390px] xl:w-[420px] lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-borderColor">
            {/* Desktop Header */}
            {renderAuthorHeader("hidden lg:flex")}

            {/* Scrollable Body: Caption + Engagement + Comments */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {rawDescription && (
                <div className="space-y-1">
                  <div
                    className={`wrap-break-word text-[14px] leading-6 text-headerColor/90 [&_p]:min-h-5 ${
                      !isExpanded && hasLongDescription ? "line-clamp-4" : ""
                    }`}
                    style={{
                      fontFamily:
                        '"Twemoji Country Flags", var(--font-segoe-ui), "Segoe UI", sans-serif',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: formattedHtml,
                    }}
                  />
                  {hasLongDescription && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded((prev) => !prev)}
                      className="text-xs font-semibold text-primaryColor hover:underline cursor-pointer"
                    >
                      {isExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              )}

              {/* Engagement Counts */}
              <div className="flex items-center justify-between pt-1 text-xs font-semibold text-descriptionColor">
                <span>{likesCount} likes</span>
                <span>{post?.total_comment || 0} comments</span>
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-2 border-y border-borderColor py-1">
                <button
                  type="button"
                  onClick={onToggleLike}
                  className={`${
                    isLiked ? "text-primaryColor" : "text-headerColor/85"
                  } flex items-center justify-center gap-2 py-2 rounded-md hover:bg-bgLightColor text-sm font-semibold cursor-pointer transition`}
                >
                  <LikeIcon
                    className={`${isLiked ? "stroke-primaryColor" : ""} h-4 w-4`}
                  />
                  <span>Like</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowComments((prev) => !prev)}
                  className="flex items-center justify-center gap-2 py-2 rounded-md hover:bg-bgLightColor text-sm font-semibold text-headerColor/85 cursor-pointer transition"
                >
                  <CommentIcon className="h-4 w-4" />
                  <span>Comments</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments && (
                <div className="-mx-2">
                  <PostComment post={post} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </RootDialog>
  );
}

export default PostImageShowDialog;
