"use client";
import { PostFeedType } from "@/lib/type";
import Image from "next/image";
import { useState } from "react";
import PostImageShowDialog from "./PostImageShowDialog";
type PostMediaItem = NonNullable<PostFeedType["media"]>[number];

function PostImageRender({ mediaItems }: any) {
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const openMediaViewer = (index: number) => {
    setActiveMediaIndex(index);
    setIsMediaViewerOpen(true);
  };
  const renderMedia = (item: PostMediaItem) => (
    <div className="relative h-full w-full overflow-hidden bg-black/5">
      <Image
        src={item.url || "/post_placeholder.png"}
        alt="Post media"
        width={10000}
        height={10000}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-fill h-full w-full bg-black/5"
      />
    </div>
  );

  const renderMediaTile = (
    item: PostMediaItem,
    index: number,
    totalCount: number,
    className = "",
  ) => {
    const hiddenCount = totalCount - 4;
    const showOverlay = index === 3 && hiddenCount > 0;

    return (
      <button
        key={item.id ?? `${item.url}-${index}`}
        type="button"
        onClick={() => openMediaViewer(index)}
        className={`relative overflow-hidden bg-[#eff1f4] ${className}`}
      >
        {renderMedia(item)}

        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-semibold text-whiteColor">
            +{hiddenCount} more
          </div>
        )}
      </button>
    );
  };
  return (
    <div>
      {mediaItems.length > 0 && (
        <div
          className={`mt-4 overflow-hidden border border-borderColor bg-[#eff1f4] ${
            mediaItems.length === 1 ? "rounded-md" : "rounded-xl"
          }`}
        >
          {mediaItems.length === 1 ? (
            <button
              type="button"
              onClick={() => openMediaViewer(0)}
              className="relative  w-full overflow-hidden"
            >
              {renderMedia(mediaItems[0])}
            </button>
          ) : mediaItems.length === 2 ? (
            <div className="grid grid-cols-2 gap-1 bg-whiteColor p-1">
              {mediaItems.slice(0, 2).map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openMediaViewer(index)}
                  className="relative aspect-square overflow-hidden rounded-md bg-[#eff1f4]"
                >
                  {renderMedia(item)}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid h-75 grid-cols-[1.25fr_0.75fr] gap-1 bg-whiteColor p-1">
              <button
                type="button"
                onClick={() => openMediaViewer(0)}
                className="relative overflow-hidden rounded-md bg-[#eff1f4]"
              >
                {renderMedia(mediaItems[0])}
              </button>

              <div className="flex h-full flex-col gap-1">
                {mediaItems
                  .slice(1, 4)
                  .map((item, index) =>
                    renderMediaTile(
                      item,
                      index + 1,
                      mediaItems.length,
                      "relative flex-1 overflow-hidden rounded-md bg-[#eff1f4]",
                    ),
                  )}
              </div>
            </div>
          )}
        </div>
      )}
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
