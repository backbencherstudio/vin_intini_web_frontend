"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import { Button } from "@/components/ui/button";
import {
  MenueArrowDownIcon,
  PlayIcon,
  SendIcon,
} from "@/public/svgIcons/Icons";

import { ImageUploadIcon } from "@/public/svgIcons/Icons";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type SubmitPayload = {
  text: string;
  media: File[];
};

function PostModal({ setPostType }: { setPostType: (type: string) => void }) {
  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleMediaButtonClick = () => {
    mediaInputRef.current?.click();
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    if (files.length === 0) {
      return;
    }

    setSelectedMedia((previous) => {
      const nextFiles = [...previous, ...files];

      setPreviewUrls((previousUrls) => {
        previousUrls.forEach((url) => URL.revokeObjectURL(url));
        return nextFiles.map((file) => URL.createObjectURL(file));
      });

      return nextFiles;
    });

    event.target.value = "";
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setSelectedMedia((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );

    setPreviewUrls((previous) => {
      const next = previous.filter((_, index) => index !== indexToRemove);
      const removed = previous[indexToRemove];
      if (removed) {
        URL.revokeObjectURL(removed);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const trimmedText = postText.trim();
    if (!trimmedText && selectedMedia.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("comment", trimmedText);
    selectedMedia.forEach((media) => {
      formData.append("media", media);
    });

    const payload: SubmitPayload = {
      text: trimmedText,
      media: selectedMedia,
    };
    console.log(payload);

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPostText("");
    setSelectedMedia([]);
    setPreviewUrls([]);
  };

  return (
    <section className="relative  px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-4">
      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleMediaChange}
      />

      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/profile.png"
              alt="Vin Intiny"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-[20px] font-semibold leading-6 text-descriptionColor">
              Vin Intiny
            </h3>

            <button
              type="button"
              onClick={() => setPostType("post_access")}
              className="mt-0.5 inline-flex items-center leading-[160%] gap-1 text-[14px] text-descriptionColor hover:opacity-80"
            >
              <span>Post for everyone</span>
              <MenueArrowDownIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <textarea
        value={postText}
        onChange={(event) => setPostText(event.target.value)}
        placeholder="What’s in you mind today?"
        rows={3}
        className="min-h-[100px] w-full resize-none bg-transparent text-[17px] leading-7 text-headerColor placeholder:text-grayColor1 focus:outline-none"
      />
      <div className="h-[150px]  ">
        {previewUrls.length > 0 && (
          <div
            className={`mb-3 grid ${selectedMedia.length == 1 ? "grid-cols-1" : selectedMedia.length == 2 ? "grid-cols-2" : "grid-cols-3"} gap-1 mt-2 space-y-2`}
          >
            {selectedMedia.slice(0, 3).map((file, index) => {
              const url = previewUrls[index];
              const isVideo = file.type.startsWith("video/");
              const hiddenCount = previewUrls.length - 3;
              const showOverlay = index === 2 && hiddenCount > 0;
              return isVideo ? (
                <div
                  key={`media-${index}`}
                  className="relative overflow-hidden rounded-md border border-borderColor"
                >
                  <video
                    src={url}
                    controls
                    className="h-[150px] w-full bg-black object-cover"
                  />
                  {showOverlay && (
                    <div className="absolute inset-0 w-full text-center leading-[100%] flex items-center justify-center bg-black/50 text-sm font-semibold text-whiteColor">
                      +{hiddenCount} more
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white"
                    aria-label={`Remove media ${index + 1}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  key={`media-${index}`}
                  className="relative overflow-hidden h-[150px] rounded-md border border-borderColor"
                >
                  <Image
                    src={url}
                    alt={`Selected media ${index + 1}`}
                    width={1200}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                  {showOverlay && (
                    <div className="absolute inset-0 w-full text-center leading-[100%] flex items-center justify-center bg-black/50 text-sm font-semibold text-whiteColor">
                      +{hiddenCount} more
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(index)}
                    className="absolute right-1 top-1 rounded-full bg-redColor/60 cursor-pointer p-1 text-xs font-medium text-white"
                    aria-label={`Remove media ${index + 1}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative inline-flex flex-col items-start">
        <SmartEmojiPicker
          onEmojiSelect={(emoji) => setPostText((prev) => prev + emoji)}
          iconClassName="w-5 h-5 text-descriptionColor cursor-pointer hover:opacity-80"
          height={200}
        />
      </div>
      <div className=" flex items-center justify-between border-t border-borderColor pt-3">
        <div className="flex justify-between items-center w-full gap-5">
          <div className="flex items-center w-full gap-2">
            <button
              type="button"
              className="cursor-pointer hover:opacity-80"
              aria-label="Add image"
              onClick={handleMediaButtonClick}
            >
              <ImageUploadIcon className="w-4 h-4 text-descriptionColor" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-descriptionColor transition hover:opacity-80"
              aria-label="Add video"
              onClick={handleMediaButtonClick}
            >
              <PlayIcon className="h-5 w-5 text-descriptionColor" />
            </button>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!postText.trim() && selectedMedia.length === 0}
            className=" h-8 rounded-full disabled:cursor-not-allowed disabled:bg-grayColor1 cursor-pointer leading-[160%] bg-buttonColor px-5 text-[14px] font-semibold text-whiteColor  hover:bg-buttonColor/90 hover:shadow-xl"
          >
            <SendIcon className="mr-1 h-2.5 w-3.5" />
            Post
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PostModal;
