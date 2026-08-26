"use client";
import { PostFeedType } from "@/lib/type";
import Image from "next/image";
import { useState } from "react";
import PostImageShowDialog from "./PostImageShowDialog";

type PostMediaItem = NonNullable<PostFeedType["media"]>[number];

interface PostImageRenderProps {
  mediaItems: PostMediaItem[];
}

function PostImageRender({ mediaItems = [] }: PostImageRenderProps) {
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const isVideo = (item: PostMediaItem): boolean => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
    const url = item.url || item.file_path || "";
    const type = item.type?.toLowerCase() || "";
    return (
      type === "video" ||
      videoExtensions.some((ext) => url.toLowerCase().includes(ext))
    );
  };

  const openMediaViewer = (index: number) => {
    setActiveMediaIndex(index);
    setIsMediaViewerOpen(true);
  };

  const renderMedia = (item: PostMediaItem, isSingle: boolean = false) => {
    const mediaUrl = item.url || item.file_path || "/post_placeholder.png";

    if (isVideo(item)) {
      return (
        <div
          className={`relative w-full overflow-hidden bg-black/90 flex items-center justify-center ${
            isSingle
              ? "min-h-auto max-h-120 h-auto"
              : "h-full min-h-35"
          }`}
        >
          <video
            src={mediaUrl}
            controls
            playsInline
            className={`w-full ${
              isSingle
                ? "max-h-120 object-contain"
                : "h-full object-cover"
            }`}
            preload="metadata"
          />
        </div>
      );
    }

    return (
      <div
        className={`relative w-full overflow-hidden bg-[#eff1f4] flex items-center justify-center ${
          isSingle
            ? "min-h-auto max-h-150 h-auto"
            : "h-full min-h-35"
        }`}
      >
        <Image
          src={mediaUrl}
          alt="Post media"
          width={1200}
          height={800}
          unoptimized
          sizes="(max-width: 768px) 100vw, 600px"
          className={`w-full ${
            isSingle
              ? "max-h-150 object-cover bg-black/5"
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
    className = ""
  ) => {
    const hiddenCount = totalCount - 4;
    const showOverlay = index === 3 && hiddenCount > 0;

    return (
      <button
        key={item.id ?? `${item.url}-${index}`}
        type="button"
        onClick={() => openMediaViewer(index)}
        className={`relative cursor-pointer overflow-hidden flex-1 w-full ${className}`}
      >
        {renderMedia(item, false)}

        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white">
            +{hiddenCount} more
          </div>
        )}
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
          <button
            type="button"
            onClick={() => openMediaViewer(0)}
            className="relative w-full overflow-hidden block bg-black/5 cursor-pointer"
          >
            {renderMedia(mediaItems[0], true)}
          </button>
        ) : /* 2 Media Items */
        mediaItems.length === 2 ? (
          <div className="grid grid-cols-2 gap-1 bg-white p-0.5 h-80">
            {mediaItems.slice(0, 2).map((item, index) => (
              <button
                key={item.id ?? index}
                type="button"
                onClick={() => openMediaViewer(index)}
                className="relative h-full w-full overflow-hidden rounded-md bg-[#eff1f4] cursor-pointer"
              >
                {renderMedia(item, false)}
              </button>
            ))}
          </div>
        ) : (
          /* 3 or More Media Items */
          <div className="grid grid-cols-[1.3fr_0.7fr] gap-1 bg-white p-0.5 h-90">
            <button
              type="button"
              onClick={() => openMediaViewer(0)}
              className="relative h-full w-full overflow-hidden rounded-md bg-[#eff1f4] cursor-pointer"
            >
              {renderMedia(mediaItems[0], false)}
            </button>

            <div className="flex h-full flex-col gap-1">
              {mediaItems
                .slice(1, 4)
                .map((item, index) =>
                  renderMediaTile(
                    item,
                    index + 1,
                    mediaItems.length,
                    "rounded-md"
                  )
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
      />
    </div>
  );
}

export default PostImageRender;