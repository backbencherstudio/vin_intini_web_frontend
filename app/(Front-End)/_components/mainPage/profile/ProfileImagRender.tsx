"use client";
import { PostFeedType } from "@/lib/type";
import { Maximize2, Play } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import PostImageShowDialog from "../post/PostImageShowDialog";

function formatDuration(seconds: number): string {
  if (!seconds || !Number.isFinite(seconds)) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function isVideoMedia(item: any): boolean {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  const url = item?.url || item?.file_path || "";
  const type = item?.type?.toLowerCase() || "";
  return (
    type === "video" ||
    videoExtensions.some((ext) => url.toLowerCase().includes(ext))
  );
}

function ProfileVideoThumbnail({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [durationLabel, setDurationLabel] = useState("");
  const [thumbReady, setThumbReady] = useState(false);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.duration && Number.isFinite(video.duration)) {
      setDurationLabel(formatDuration(video.duration));
      if (video.currentTime === 0) {
        video.currentTime = Math.min(1.5, Math.max(0.2, video.duration * 0.15));
      }
    }
  };

  return (
    <div className="group/video-tile relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={() => setThumbReady(true)}
        onSeeked={() => setThumbReady(true)}
        className={`pointer-events-none h-full w-full object-cover transition-opacity duration-300 ${
          thumbReady ? "opacity-100" : "opacity-80"
        }`}
      />

      {/* Sleek Overlay + Frosted Play Button */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/55 via-black/15 to-black/20 transition-colors group-hover/video-tile:bg-black/30">
        <span className="flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full bg-white/95 text-primaryColor shadow-2xl ring-4 ring-white/25 backdrop-blur-md transition-transform duration-200 group-hover/video-tile:scale-110">
          <Play className="h-6 w-6 fill-current translate-x-0.5" />
        </span>

        {durationLabel && (
          <span className="absolute bottom-2.5 left-2.5 rounded-md bg-black/75 px-2 py-0.5 text-xs font-semibold tracking-wide text-white backdrop-blur-xs">
            {durationLabel}
          </span>
        )}

        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white/95 backdrop-blur-xs border border-white/15">
          <Maximize2 className="h-3 w-3" />
          <span className="hidden sm:inline">Play video</span>
        </span>
      </div>
    </div>
  );
}

type ProfileImagRenderProps = {
  mediaItems: NonNullable<PostFeedType["media"]>;
  post?: PostFeedType;
  isLiked?: boolean;
  likesCount?: number;
  onToggleLike?: () => void;
};

function ProfileImagRender({
  mediaItems,
  post,
  isLiked = false,
  likesCount = 0,
  onToggleLike,
}: ProfileImagRenderProps) {
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlayVideo, setAutoPlayVideo] = useState(false);
  const total = mediaItems?.length || 0;
  const hasVideo = mediaItems?.some(isVideoMedia);

  const openMediaViewer = (index: number) => {
    document.querySelectorAll("video").forEach((video) => {
      if (!video.paused) video.pause();
    });
    const clickedItem = mediaItems[index];
    setAutoPlayVideo(Boolean(clickedItem && isVideoMedia(clickedItem)));
    setActiveMediaIndex(index);
    setIsMediaViewerOpen(true);
  };

  if (!total) return null;

  return (
    <div className="relative w-full">
      {total > 1 && (
        <div className="absolute top-2.5 right-2.5 z-20 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-xs border border-white/15">
          {`${activeIndex + 1}/${total}`}
        </div>
      )}

      <Swiper
        modules={[Autoplay]}
        autoplay={
          total > 1 && !hasVideo && !isMediaViewerOpen
            ? { delay: 3000, disableOnInteraction: false }
            : false
        }
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full"
      >
        {mediaItems.map((m, idx) => (
          <SwiperSlide key={m.id || idx}>
            <button
              type="button"
              onClick={() => openMediaViewer(idx)}
              aria-label={
                isVideoMedia(m)
                  ? `Play video ${idx + 1} in theater view`
                  : `View media ${idx + 1}`
              }
              className="block w-full h-64 sm:h-72 md:h-80 lg:h-88 overflow-hidden rounded-lg bg-gray-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor"
            >
              {isVideoMedia(m) ? (
                <ProfileVideoThumbnail src={m.url || m.file_path || ""} />
              ) : (
                <Image
                  src={m.url || m.file_path || "/post_placeholder.png"}
                  alt={m.type || `media-${idx}`}
                  width={700}
                  height={500}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

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
        autoPlayVideo={autoPlayVideo}
      />
    </div>
  );
}

export default ProfileImagRender;
