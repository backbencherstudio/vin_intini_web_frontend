"use client";

import RootDialog from "@/components/reusable/RootDialog";
import { PostFeedType } from "@/lib/type";
import { formatContentForDisplay, formatPostDate } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import { CommentIcon, LikeIcon } from "@/public/svgIcons/Icons";
import { ChevronLeft, ChevronRight, Loader2, Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import PostComment from "./PostComment";

function formatDuration(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds)) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function TheaterVideoPlayer({
  src,
  isActive,
  initialTime = 0,
  autoPlay = false,
}: {
  src: string;
  isActive: boolean;
  initialTime?: number;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(
    initialTime > 0 || autoPlay,
  );
  const [durationLabel, setDurationLabel] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setHasStarted(initialTime > 0 || autoPlay);
    setIsReady(false);
  }, [src, initialTime, autoPlay]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!isActive && !vid.paused) {
      vid.pause();
    }
  }, [isActive]);

  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.duration && Number.isFinite(vid.duration)) {
      setDurationLabel(formatDuration(vid.duration));
    }

    if (initialTime > 0) {
      vid.currentTime = initialTime;
      if (autoPlay && isActive) {
        vid.play().catch(() => {});
      }
      return;
    }

    if (!hasStarted && vid.currentTime === 0 && vid.duration) {
      vid.currentTime = Math.min(1.5, Math.max(0.2, vid.duration * 0.15));
    }
  };

  const handleStartPlayback = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;

    if (!hasStarted) {
      vid.currentTime = 0;
      setHasStarted(true);
    }
    vid.play().catch(() => {});
  };

  return (
    <div className="group/theater-video relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#0b0d10]">
      <video
        ref={videoRef}
        src={src}
        controls={hasStarted && isReady}
        playsInline
        preload={isActive ? "auto" : "metadata"}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={() => setIsReady(true)}
        onCanPlay={() => setIsReady(true)}
        onSeeked={() => setIsReady(true)}
        onPlay={() => setHasStarted(true)}
        className={`h-full w-full max-h-full max-w-full object-contain transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sleek full-stage loading indicator while first frame buffers */}
      {!isReady && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-white/80">
          <Loader2 className="h-8 w-8 animate-spin text-primaryColor" />
          <span className="text-xs font-medium text-white/60">
            Loading video...
          </span>
        </div>
      )}

      {isReady && !hasStarted && (
        <button
          type="button"
          onClick={handleStartPlayback}
          aria-label="Play video"
          className="absolute inset-0 z-10 flex items-center justify-center bg-linear-to-t from-black/55 via-black/10 to-black/20 cursor-pointer transition-colors hover:bg-black/25"
        >
          <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/95 text-primaryColor shadow-2xl ring-4 ring-white/25 backdrop-blur-md transition-transform duration-200 group-hover/theater-video:scale-110">
            <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current translate-x-0.5" />
          </span>

          {durationLabel && (
            <span className="absolute bottom-3 left-3 rounded-md bg-black/75 px-2 py-0.5 text-xs font-semibold tracking-wide text-white backdrop-blur-xs">
              {durationLabel}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

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
  initialVideoTime?: number;
  autoPlayVideo?: boolean;
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
  initialVideoTime = 0,
  autoPlayVideo = false,
}: PostImageShowDialogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setIsExpanded(false);
      setShowComments(true);
    }
  }, [open, post?.id]);

  // Reset zoom & pan when switching slides or closing dialog
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, [open, activeMediaIndex]);

  // Pause all videos inside the dialog whenever slide changes or dialog closes
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.querySelectorAll("video").forEach((video, idx) => {
      if (!open || idx !== activeMediaIndex) {
        if (!video.paused) video.pause();
      }
    });
  }, [open, activeMediaIndex]);

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

  const activeItem = mediaItems[activeMediaIndex];
  const activeIsVideo = activeItem ? isVideo(activeItem) : false;

  const clampZoom = (next: number) => Math.min(4, Math.max(1, Number(next.toFixed(2))));

  const updateZoom = (nextZoom: number) => {
    const clamped = clampZoom(nextZoom);
    setZoom(clamped);
    if (clamped <= 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  const handleZoomIn = () => updateZoom(zoom + 0.5);
  const handleZoomOut = () => updateZoom(zoom - 0.5);
  const handleResetZoom = () => updateZoom(1);

  const handleStageWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (activeIsVideo) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    updateZoom(zoom + delta);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeIsVideo || zoom <= 1) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragOriginRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragOriginRef.current) return;
    const dx = e.clientX - dragOriginRef.current.x;
    const dy = e.clientY - dragOriginRef.current.y;
    const maxOffset = (zoom - 1) * 260;
    setPan({
      x: Math.max(-maxOffset, Math.min(maxOffset, dragOriginRef.current.panX + dx)),
      y: Math.max(-maxOffset, Math.min(maxOffset, dragOriginRef.current.panY + dy)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragOriginRef.current = null;
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
      if (!activeIsVideo) {
        if (event.key === "+" || event.key === "=") {
          updateZoom(zoom + 0.5);
        } else if (event.key === "-") {
          updateZoom(zoom - 0.5);
        } else if (event.key === "0") {
          updateZoom(1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, activeMediaIndex, mediaItems.length, activeIsVideo, zoom]);

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
          ref={stageRef}
          className={`relative bg-[#0b0d10] flex items-center justify-center overflow-hidden select-none ${
            post
              ? "h-[40dvh] sm:h-[46dvh] shrink-0 lg:h-full lg:flex-1 lg:min-w-0"
              : "h-[80vh] w-full flex-1"
          }`}
        >
          {mediaItems.length > 1 && (
            <div className="absolute top-3 left-3 z-20 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs border border-white/10">
              {activeMediaIndex + 1} / {mediaItems.length}
            </div>
          )}

          {!activeIsVideo && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-white backdrop-blur-xs border border-white/10">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                title="Zoom out (-)"
                aria-label="Zoom out"
                className="rounded-full p-1 transition hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="min-w-11 text-center text-xs font-medium tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 4}
                title="Zoom in (+)"
                aria-label="Zoom in"
                className="rounded-full p-1 transition hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              {zoom > 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Reset zoom (0)"
                  aria-label="Reset zoom"
                  className="ml-0.5 rounded-full border-l border-white/15 pl-1.5 pr-1 py-1 transition hover:bg-white/15 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
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

          <div
            className="relative h-full w-full overflow-hidden"
            onWheel={handleStageWheel}
          >
            <div
              className="flex h-full w-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeMediaIndex * 100}%)` }}
            >
              {mediaItems.map((item, idx) => {
                const isCurrent = idx === activeMediaIndex;
                return (
                  <div
                    key={item.id ?? `${item.url}-${idx}`}
                    onDoubleClick={() => {
                      if (!isVideo(item) && isCurrent) {
                        updateZoom(zoom > 1 ? 1 : 2);
                      }
                    }}
                    onPointerDown={isCurrent ? handlePointerDown : undefined}
                    onPointerMove={isCurrent ? handlePointerMove : undefined}
                    onPointerUp={isCurrent ? handlePointerUp : undefined}
                    onPointerCancel={isCurrent ? handlePointerUp : undefined}
                    className={`relative flex h-full min-w-full items-center justify-center p-2 sm:p-4 overflow-hidden ${
                      !isVideo(item) && isCurrent
                        ? zoom > 1
                          ? isDragging
                            ? "cursor-grabbing"
                            : "cursor-grab"
                          : "cursor-zoom-in"
                        : ""
                    }`}
                  >
                    {isVideo(item) ? (
                      <TheaterVideoPlayer
                        src={item.url || item.file_path || ""}
                        isActive={open && isCurrent}
                        initialTime={isCurrent ? initialVideoTime : 0}
                        autoPlay={isCurrent ? autoPlayVideo : false}
                      />
                    ) : (
                      <Image
                        src={item.url || item.file_path || "/post_placeholder.png"}
                        alt="Post image preview"
                        width={1400}
                        height={1000}
                        unoptimized
                        draggable={false}
                        sizes="(max-width: 1024px) 96vw, 65vw"
                        style={
                          isCurrent
                            ? {
                                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                                transition: isDragging
                                  ? "none"
                                  : "transform 180ms ease-out",
                              }
                            : undefined
                        }
                        className="max-h-full max-w-full w-auto h-auto object-contain select-none"
                      />
                    )}
                  </div>
                );
              })}
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
