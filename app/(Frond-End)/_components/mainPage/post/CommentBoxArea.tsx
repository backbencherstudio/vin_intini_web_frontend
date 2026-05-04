"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import { useCommentPostByIdMutation } from "@/feature/slice/post/commentSlice";

import { EmojiIcon, ImageUploadIcon } from "@/public/svgIcons/Icons";
import EmojiPicker, {
  Categories,
  type EmojiClickData,
} from "emoji-picker-react";
import { Loader, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type SubmitPayload = {
  text: string;
  image: File | null;
};

function CommentBoxArea({
  postId,
  parentId,
}: {
  postId?: number;
  parentId?: number | null;
}) {
  const [commentText, setCommentText] = useState("");
  const [commentPostById, { isLoading }] = useCommentPostByIdMutation();
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const emojiButtonRef = useRef<HTMLButtonElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    const file = Array.from(event.target.files || []).find((file) =>
      file.type.startsWith("image/"),
    );

    if (!file) {
      event.target.value = "";
      return;
    }

    setSelectedImage((previous) => {
      if (previous && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      return file;
    });

    setPreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return URL.createObjectURL(file);
    });

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    const trimmedText = commentText.trim();
    if (!postId) {
      console.error("Missing postId for comment submission");
      return;
    }

    if (!trimmedText && !selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append("comment", trimmedText);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if (parentId) {
      formData.append("parent_id", parentId.toString());
    }

    try {
      const response = await commentPostById({
        postData: formData,
        postId,
      }).unwrap();
      toast.success(response?.message || "Comment posted successfully!");
      setCommentText("");
      setSelectedImage(null);
      setPreviewUrl(null);
      setIsEmojiOpen(false);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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

        {previewUrl && (
          <div className="mb-2">
            <div className="relative w-24 h-20 overflow-hidden rounded-md border border-borderColor">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover w-full h-fullf"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-redColor/70 text-xs text-whiteColor"
                aria-label="Remove image"
              >
                <X size={10} />
              </button>
            </div>
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
            loading={isLoading}
            sendingMsg={<Loader className="animate-spin w-4 h-4" />}
            disabled={(!commentText.trim() && !selectedImage) || isLoading}
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
