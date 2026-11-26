"use client";
import { PostFeedType } from "@/lib/type";
import { Maximize2, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PostImageShowDialog from "./PostImageShowDialog";

type PostMediaItem = NonNullable<PostFeedType["media"]>[number];

interface PostImageRenderProps {
  mediaItems: PostMediaItem[];
  priority?: boolean;
  post?: PostFeedType;
  isLiked?: boolean;
  likesCount?: number;
  onToggleLike?: () => void;
}

function formatDuration(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds)) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Senior UI/UX Feed Video Player: real video-frame thumbnail, duration pill, frosted play button, & theater expand
function FeedVideoPlayer({
  src,
  isSingle = false,
  onOpenTheater,
}: {
  src: string;
  isSingle?: boolean;
  onOpenTheater?: (currentTime: number, wasPlaying: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [durationLabel, setDurationLabel] = useState("");
  const [thumbReady, setThumbReady] = useState(false);

  // Auto-pause video when it completely scrolls out of the viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.duration && Number.isFinite(video.duration)) {
      setDurationLabel(formatDuration(video.duration));
      // Seek to ~1.5s (or 15% of short clips) while paused to avoid black fade-in frame at 0:00
      if (!hasStarted && video.currentTime === 0) {
        const previewTime = Math.min(1.5, Math.max(0.2, video.duration * 0.15));
        video.currentTime = previewTime;
      }
    }
  };

  const handleSeeked = () => {
    if (!hasStarted) {
      setThumbReady(true);
    }
  };

  const handleStartPlayback = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (!hasStarted) {
      video.currentTime = 0;
      setHasStarted(true);
    }
    video.play().catch(() => {});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLVideoElement>) => {
    const video = videoRef.current;
    if (!video) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      video.currentTime = Math.max(0, video.currentTime - 5);
    } else if (e.key === " " || e.key === "k") {
      e.preventDefault();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    const currentTime = hasStarted && video ? video.currentTime : 0;
    const wasPlaying = Boolean(video && !video.paused);
    if (video && !video.paused) {
      video.pause();
    }
    onOpenTheater?.(currentTime, wasPlaying);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`group/video relative w-full overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center ${
        isSingle
          ? "min-h-60 max-h-[65vh] sm:max-h-125 h-auto"
          : "h-full min-h-0"
      }`}
    >
      <video
        ref={videoRef}
        src={src}
        controls={hasStarted}
        playsInline
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={handleSeeked}
        onPlay={() => setHasStarted(true)}
        onKeyDown={handleKeyDown}
        className={`w-full outline-hidden transition-opacity duration-300 ${
          thumbReady || hasStarted ? "opacity-100" : "opacity-85"
        } ${
          isSingle
            ? "max-h-[65vh] sm:max-h-125 object-contain"
            : "h-full object-cover"
        }`}
      />

      {/* Sleek Thumbnail Overlay before first play */}
      {!hasStarted && (
        <button
          type="button"
          onClick={handleStartPlayback}
          aria-label="Play video"
          className="absolute inset-0 z-10 flex items-center justify-center bg-linear-to-t from-black/55 via-black/10 to-black/20 cursor-pointer transition-colors hover:bg-black/25"
        >
          <span className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/95 text-primaryColor shadow-2xl ring-4 ring-white/25 backdrop-blur-md transition-transform duration-200 group-hover/video:scale-110">
            <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-current translate-x-0.5" />
          </span>

          {durationLabel && (
            <span className="absolute bottom-3 left-3 rounded-md bg-black/75 px-2 py-0.5 text-xs font-semibold tracking-wide text-white backdrop-blur-xs">
              {durationLabel}
            </span>
          )}
        </button>
      )}

      {onOpenTheater && (
        <button
          type="button"
          onClick={handleExpandClick}
          title="Open theater view"
          aria-label="Open video in theater view"
          className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-xs border border-white/15 opacity-95 sm:opacity-0 sm:group-hover/video:opacity-100 transition-opacity hover:bg-black/80 cursor-pointer"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function PostImageRender({
  mediaItems = [],
  priority = false,
  post,
  isLiked,
  likesCount,
  onToggleLike,
}: PostImageRenderProps) {
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [initialVideoTime, setInitialVideoTime] = useState(0);
  const [shouldAutoPlayVideo, setShouldAutoPlayVideo] = useState(false);

  // Global listener: ensure only 1 video plays at a time across the page
  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const currentVideo = e.target as HTMLVideoElement;
      if (!currentVideo || currentVideo.tagName !== "VIDEO") return;

      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((video) => {
        if (video !== currentVideo && !video.paused) {
          video.pause();
        }
      });
    };

    document.addEventListener("play", handleGlobalPlay, true);
    return () => {
      document.removeEventListener("play", handleGlobalPlay, true);
    };
  }, []);

  const isVideo = (item: PostMediaItem): boolean => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
    const url = item.url || item.file_path || "";
    const type = item.type?.toLowerCase() || "";
    return (
      type === "video" ||
      videoExtensions.some((ext) => url.toLowerCase().includes(ext))
    );
  };

  const openMediaViewer = (
    index: number,
    currentTime = 0,
    wasPlaying = false,
  ) => {
    // Pause any playing feed videos before opening the theater viewer
    document.querySelectorAll("video").forEach((video) => {
      if (!video.paused) video.pause();
    });
    setInitialVideoTime(currentTime);
    setShouldAutoPlayVideo(wasPlaying);
    setActiveMediaIndex(index);
    setIsMediaViewerOpen(true);
  };

  const renderImage = (
    item: PostMediaItem,
    isSingle: boolean = false,
    isPriority: boolean = false
  ) => {
    const mediaUrl = item.url || item.file_path || "/post_placeholder.png";

    return (
      <div
        className={`relative w-full overflow-hidden bg-[#eff1f4] flex items-center justify-center ${
          isSingle ? "min-h-auto max-h-150 h-auto" : "h-full min-h-0"
        }`}
      >
        <Image
          src={mediaUrl}
          alt="Post media"
          width={1200}
          height={800}
          unoptimized
          priority={isPriority}
          loading={isPriority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 600px"
          className={`w-full ${
            isSingle
              ? "h-auto max-h-150 object-cover bg-black/5"
              : "h-full object-cover"
          }`}
        />
      </div>
    );
  };

  const renderMediaTile = (
    item: PostMediaItem,
    index: number,
    totalCount: number,
    maxVisible: number,
    className = "rounded-md"
  ) => {
    const hiddenCount = totalCount - maxVisible;
    const showOverlay = index === maxVisible - 1 && hiddenCount > 0;
    const isVid = isVideo(item);
    const mediaUrl = item.url || item.file_path || "";

    // If overlay with "+N" is shown, clicking it opens the viewer at this index
    if (showOverlay) {
      return (
        <button
          key={item.id ?? `${item.url}-${index}`}
          type="button"
          onClick={() => openMediaViewer(index)}
          className={`relative cursor-pointer overflow-hidden h-full w-full min-h-0 min-w-0 block ${className}`}
        >
          {isVid ? (
            <FeedVideoPlayer src={mediaUrl} isSingle={false} />
          ) : (
            renderImage(item, false, priority && index === 0)
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[1px] text-white transition-colors hover:bg-black/65">
            <span className="text-2xl font-bold leading-none">
              +{hiddenCount}
            </span>
            <span className="mt-1 text-xs font-medium text-white/90">
              View all ({totalCount})
            </span>
          </div>
        </button>
      );
    }

    // Multi-media video tile: play inline or expand to theater viewer
    if (isVid) {
      return (
        <div
          key={item.id ?? `${item.url}-${index}`}
          className={`relative overflow-hidden h-full w-full min-h-0 min-w-0 bg-black ${className}`}
        >
          <FeedVideoPlayer
            src={mediaUrl}
            isSingle={false}
            onOpenTheater={(time, playing) =>
              openMediaViewer(index, time, playing)
            }
          />
        </div>
      );
    }

    // Image tile: clicking opens dialog viewer
    return (
      <button
        key={item.id ?? `${item.url}-${index}`}
        type="button"
        onClick={() => openMediaViewer(index)}
        className={`relative cursor-pointer overflow-hidden h-full w-full min-h-0 min-w-0 block bg-[#eff1f4] ${className}`}
      >
        {renderImage(item, false, priority && index === 0)}
      </button>
    );
  };

  if (!mediaItems || mediaItems.length === 0) return null;

  return (
    <div className="w-full">
      <div
        className={`mt-3 overflow-hidden border border-gray-100 ${
          mediaItems.length === 1 ? "rounded-lg" : "rounded-xl"
        }`}
      >
        {/* 1 Media (Single Image / Video) */}
        {mediaItems.length === 1 ? (
          isVideo(mediaItems[0]) ? (
            <div className="relative w-full overflow-hidden block bg-black rounded-lg">
              <FeedVideoPlayer
                src={mediaItems[0].url || mediaItems[0].file_path || ""}
                isSingle={true}
                onOpenTheater={(time, playing) =>
                  openMediaViewer(0, time, playing)
                }
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openMediaViewer(0)}
              className="relative w-full overflow-hidden block bg-black/5 cursor-pointer rounded-lg"
            >
              {renderImage(mediaItems[0], true, priority)}
            </button>
          )
        ) : /* 2 Media Items */
        mediaItems.length === 2 ? (
          <div className="grid grid-cols-2 gap-1 bg-white p-0.5 h-72 sm:h-80">
            {mediaItems
              .slice(0, 2)
              .map((item, index) =>
                renderMediaTile(item, index, mediaItems.length, 2),
              )}
          </div>
        ) : /* 3 Media Items (1 large left + 2 equal stacked right) */
        mediaItems.length === 3 ? (
          <div className="grid grid-cols-[1.35fr_0.65fr] gap-1 bg-white p-0.5 h-80 sm:h-90">
            {renderMediaTile(mediaItems[0], 0, 3, 3)}
            <div className="grid grid-rows-2 gap-1 h-full min-h-0">
              {mediaItems
                .slice(1, 3)
                .map((item, index) => renderMediaTile(item, index + 1, 3, 3))}
            </div>
          </div>
        ) : /* 4 Media Items (Clean 2x2 Grid) */
        mediaItems.length === 4 ? (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 bg-white p-0.5 h-84 sm:h-96">
            {mediaItems
              .slice(0, 4)
              .map((item, index) => renderMediaTile(item, index, 4, 4))}
          </div>
        ) : (
          /* 5 or More Media Items (2 top + 3 bottom collage with +N overlay on 5th) */
          <div className="grid grid-rows-[1.15fr_0.85fr] gap-1 bg-white p-0.5 h-88 sm:h-104">
            <div className="grid grid-cols-2 gap-1 min-h-0">
              {mediaItems
                .slice(0, 2)
                .map((item, index) =>
                  renderMediaTile(item, index, mediaItems.length, 5),
                )}
            </div>
            <div className="grid grid-cols-3 gap-1 min-h-0">
              {mediaItems
                .slice(2, 5)
                .map((item, index) =>
                  renderMediaTile(item, index + 2, mediaItems.length, 5),
                )}
            </div>
          </div>
        )}
      </div>

      <PostImageShowDialog
        open={isMediaViewerOpen}
        setOpen={setIsMediaViewerOpen}
        mediaItems={mediaItems}
        activeMediaIndex={activeMediaIndex}
        setActiveMediaIndex={setActiveMediaIndex}
        post={post}
        isLiked={isLiked}
        likesCount={likesCount}
        onToggleLike={onToggleLike}
        initialVideoTime={initialVideoTime}
        autoPlayVideo={shouldAutoPlayVideo}
      />
    </div>
  );
}

export default PostImageRender;
