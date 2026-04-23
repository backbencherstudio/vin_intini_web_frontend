"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { EmojiIcon, ImageUploadIcon } from "@/public/svgIcons/Icons";
import EmojiPicker, {
  Categories,
  type EmojiClickData,
} from "emoji-picker-react";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type SubmitPayload = {
  text: string;
  images: File[];
};

function CommentBoxArea() {
  const [commentText, setCommentText] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (!isEmojiOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (emojiPickerRef.current?.contains(target)) {
        return;
      }

      if (emojiButtonRef.current?.contains(target)) {
        return;
      }

      setIsEmojiOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isEmojiOpen]);

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setCommentText((previous) => `${previous}${emojiData.emoji}`);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) {
      return;
    }

    setSelectedImages((previous) => {
      const nextFiles = [...previous, ...files];

      setPreviewUrls((previousUrls) => {
        previousUrls.forEach((url) => URL.revokeObjectURL(url));
        return nextFiles.map((file) => URL.createObjectURL(file));
      });

      return nextFiles;
    });

    event.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages((previous) =>
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
    const trimmedText = commentText.trim();
    if (!trimmedText && selectedImages.length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("comment", trimmedText);
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    const payload: SubmitPayload = {
      text: trimmedText,
      images: selectedImages,
    };
    console.log(payload);

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setCommentText("");
    setSelectedImages([]);
    setPreviewUrls([]);
    setIsEmojiOpen(false);
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImagesChange}
      />

      <div className="w-full rounded-xl border border-headerColor/40 bg-bgLightColor p-2 md:p-3">
        <textarea
          placeholder="type..."
          rows={2}
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          className="w-full resize-none bg-transparent text-[16px] leading-6 text-headerColor placeholder:text-grayColor1 focus:outline-none"
        />

        {previewUrls.length > 0 && (
          <div className="mb-1 flex items-center gap-2">
            {previewUrls.slice(0, 3).map((url, index) => {
              const hiddenCount = previewUrls.length - 3;
              const showOverlay = index === 2 && hiddenCount > 0;

              return (
                <div
                  key={`${url}-${index}`}
                  className="relative w-10 h-10 overflow-hidden rounded-md border border-borderColor"
                >
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  {showOverlay && (
                    <div className="absolute inset-0 w-full text-center leading-[100%] flex items-center justify-center bg-black/50 text-xs font-semibold text-whiteColor">
                      +{hiddenCount} more
                    </div>
                  )}

                  {!showOverlay && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-0 top-0 cursor-pointer rounded-full bg-redColor/55 h-4 w-4 leading-0 flex justify-center items-center  text-xs text-whiteColor"
                      aria-label="Remove image"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-borderColor pt-2.5">
          <div className="flex items-center gap-5 text-descriptionColor">
            <button
              type="button"
              className="cursor-pointer hover:opacity-80"
              aria-label="Add image"
              onClick={handleImageButtonClick}
            >
              <ImageUploadIcon className="w-4 h-4" />
            </button>
            <button
              ref={emojiButtonRef}
              type="button"
              className="cursor-pointer hover:opacity-80"
              aria-label="Add emoji"
              onClick={() => setIsEmojiOpen((previous) => !previous)}
            >
              <EmojiIcon className="w-4 h-4" />
            </button>
          </div>

          <ButtonReuseable
            title="Comment"
            type="button"
            onClick={handleSubmit}
            disabled={!commentText.trim() && selectedImages.length === 0}
            className="py-1! leading-[140%]! rounded-full! bg-buttonColor px-5 text-[14px]! font-semibold text-whiteColor hover:opacity-90 cursor-pointer"
          />
        </div>
      </div>

      {isEmojiOpen && (
        <div
          ref={emojiPickerRef}
          className="absolute left-0 top-full z-20 mt-2"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            lazyLoadEmojis
            previewConfig={{ showPreview: false }}
            className="comment-emoji-picker"
            categories={[
              { category: Categories.SMILEYS_PEOPLE, name: "Smileys & People" },
              { category: Categories.ANIMALS_NATURE, name: "Animals & Nature" },
              { category: Categories.FOOD_DRINK, name: "Food & Drink" },
              { category: Categories.TRAVEL_PLACES, name: "Travel & Places" },
              { category: Categories.ACTIVITIES, name: "Activities" },
              { category: Categories.OBJECTS, name: "Objects" },
              { category: Categories.SYMBOLS, name: "Symbols" },
              { category: Categories.FLAGS, name: "Flags" },
            ]}
            style={{
              ["--epr-emoji-size" as string]: "20px",
              ["--epr-emoji-gap" as string]: "6px",
              ["--epr-category-navigation-button-size" as string]: "24px",
              ["--epr-category-icon-active-color" as string]: "#ef4444",
            }}
            width={260}
            height={300}
          />
        </div>
      )}

      <style jsx global>{`
        .comment-emoji-picker
          .epr-emoji-category[aria-label="Frequently Used"] {
          display: none !important;
        }

        .comment-emoji-picker
          .epr-category-nav
          button[aria-label="Frequently Used"] {
          display: none !important;
        }

        .comment-emoji-picker .epr-category-nav .epr-btn {
          transform: scale(0.92);
          transition:
            transform 0.15s ease,
            color 0.15s ease;
        }

        .comment-emoji-picker .epr-category-nav .epr-btn.epr-active {
          color: #ef4444 !important;
          transform: scale(0.84);
        }
      `}</style>
    </div>
  );
}

export default CommentBoxArea;
