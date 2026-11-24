"use client";

import ButtonReuseable from "@/components/reusable/CustomButton";
import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import { useCommentPostByIdMutation } from "@/feature/slice/post/commentSlice";
import { ImageUploadIcon } from "@/public/svgIcons/Icons";
import { Loader, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type SubmitPayload = {
  text: string;
  image: File | null;
};

function CommentBoxArea({
  postId,
  parentId,
  replyToUserId,
  replyToReplyId,
  replyingToUserName,
  placeholder,
  autoFocus,
  isInline,
  onCancelReply,
  onSuccess,
}: {
  postId?: number;
  parentId?: number | null;
  replyToUserId?: number | null;
  replyToReplyId?: number | null;
  replyingToUserName?: string | null;
  placeholder?: string;
  autoFocus?: boolean;
  isInline?: boolean;
  onCancelReply?: () => void;
  onSuccess?: () => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [commentPostById, { isLoading , isError}] = useCommentPostByIdMutation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pathName = usePathname();
  useEffect(() => {
    if ((autoFocus || replyingToUserName) && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus, replyingToUserName]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Set the height based on scrollHeight, with max height of 80px (max-h-20)
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 80; // max-h-20 in pixels

    if (scrollHeight <= maxHeight) {
      textarea.style.height = scrollHeight + "px";
      textarea.style.overflowY = "hidden";
    } else {
      textarea.style.height = maxHeight + "px";
      textarea.style.overflowY = "auto";
    }
  }, [commentText]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Set initial height on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // h-10 = 40px
    }
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setCommentText((prev) => `${prev}${emoji}`);
      return;
    }

    const start = textarea.selectionStart ?? commentText.length;
    const end = textarea.selectionEnd ?? commentText.length;

    const newText =
      commentText.slice(0, start) + emoji + commentText.slice(end);
    setCommentText(newText);

    const nextPos = start + emoji.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextPos, nextPos);
    });
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
    if (trimmedText) {
      formData.append("comment", trimmedText);
    }

    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    if(pathName.includes("industry-profile")){
      formData.append("as_company", "true");
    }
    if (parentId) {
      formData.append("parent_id", parentId.toString());
    }
    if (replyToUserId) {
      formData.append("reply_to_user_id", replyToUserId.toString());
    }
    if (replyToReplyId) {
      formData.append("reply_to_reply_id", replyToReplyId.toString());
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
      onCancelReply?.();
      onSuccess?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to post comment");
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

      <div className={`w-full rounded-xl border border-headerColor/40 bg-bgLightColor ${isInline ? "p-2" : "p-2 md:p-3"} ${isError ? "border-redColor" : ""}`}>
        {replyingToUserName && (
          <div className="mb-2 flex items-center justify-between bg-primaryColor/10 border border-primaryColor/20 rounded-lg py-1 px-3">
            <span className="text-[13px] text-headerColor">
              Replying to{" "}
              <span className="font-semibold text-primaryColor">@{replyingToUserName}</span>
            </span>
            <button
              type="button"
              onClick={onCancelReply}
              className="text-[13px] p-0.5 rounded-full text-descriptionColor hover:text-redColor cursor-pointer transition-colors"
              aria-label="Cancel reply"
            >
              ✕
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          placeholder={placeholder || (replyingToUserName ? `Write a reply to ${replyingToUserName}...` : "Write a comment...")}
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          className="w-full resize-none bg-transparent text-[16px] leading-6 text-headerColor placeholder:text-grayColor1 focus:outline-none transition-all"
          style={{
            fontFamily: '"Twemoji Country Flags", var(--font-segoe-ui), "Segoe UI", sans-serif',
          }}
        />

        {previewUrl && (
          <div className="mb-2">
            <div className={`relative w-24 h-20 overflow-hidden rounded-md border border-borderColor  ${isError ? "border-redColor" : ""}`}>
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                sizes="96px"
                className="object-cover w-full h-full"
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
          <div className="flex items-center gap-1.5 text-descriptionColor">
            <button
              type="button"
              className="p-1 rounded-full hover:bg-gray-100 cursor-pointer hover:opacity-80 transition"
              aria-label="Add image"
              onClick={handleImageButtonClick}
            >
              <ImageUploadIcon className="w-4 h-4" />
            </button>
            <SmartEmojiPicker
              onEmojiSelect={handleEmojiSelect}
              iconClassName="w-4 h-4"
              direction="up"
              theme="light"
              height={290}
              width={300}
            />
          </div>

          <ButtonReuseable
            title={parentId || replyingToUserName ? "Reply" : "Comment"}
            type="button"
            onClick={handleSubmit}
            loading={isLoading}
            sendingMsg={<Loader className="animate-spin w-4 h-4" />}
            disabled={(!commentText.trim() && !selectedImage) || isLoading}
            className="py-1! leading-[140%]! rounded-full! bg-buttonColor px-5 text-[14px]! font-semibold text-whiteColor hover:opacity-90 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default CommentBoxArea;
