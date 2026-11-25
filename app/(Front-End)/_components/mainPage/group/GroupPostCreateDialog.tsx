"use client";

import SmartEmojiPicker from "@/components/reusable/SmartEmojiPicker";
import {
  useCreatePostMutation,
  useUpdateGroupPostMutation,
} from "@/feature/slice/post/postSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import {
  BanIcon,
  GlobalIcon,
  GroupUserIcon,
  MenueArrowDownIcon,
  MultiUserIcon,
  PlayIcon,
  SendIcon,
} from "@/public/svgIcons/Icons";
import { useDispatch } from "react-redux";

import RootDialog from "@/components/reusable/RootDialog";
import { resetPostComposeState } from "@/feature/slice/postCompose/postComposeSlice";
import { htmlToPlainText, textToHtml } from "@/lib/utils";
import { ImageUploadIcon } from "@/public/svgIcons/Icons";
import { ArrowLeft, Loader, MessageSquare, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type PreviewMedia = {
  source: string;
  type: "image" | "video";
  file?: File;
  isObjectUrl?: boolean;
  id?: number;
};

function GroupPostCreateDialog({
  setOpen,
  open,
  groupId,
  postData,
}: {
  setOpen: (open: boolean) => void;
  open: boolean;
  groupId?: number;
  postData?: any;
}) {
  const params = useParams();
  const groupsId = Array.isArray(params?.groupId)
    ? params.groupId[0]
    : params?.groupId;
  const [postText, setPostText] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [visibilityOption, setVisibilityOption] = useState<"anyone" | "members">(
    "members",
  );
  const [commentControl, setCommentControl] = useState<
    "anyone" | "connections" | "no_one"
  >("anyone");
  const { data } = useGetUserProfileQuery("user");
  const [previewMedia, setPreviewMedia] = useState<PreviewMedia[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const dispatch = useDispatch();
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [updateGroupPost, { isLoading: isUpdating }] =
    useUpdateGroupPostMutation();
  useEffect(() => {
    const rawText = postData?.description || postData?.content || "";
    setPostText(rawText ? htmlToPlainText(rawText) : "");
    setCommentControl(
      postData?.who_can_comment === "connections" ||
        postData?.who_can_comment === "no_one"
        ? postData.who_can_comment
        : "anyone",
    );
    setVisibilityOption(
      postData?.visibility === "public" ? "anyone" : "members",
    );
    setShowSettings(false);
    setRemovedMediaIds([]);

    setPreviewMedia((previous) => {
      previous.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.source);
        }
      });

      return (
        postData?.media?.map(
          (media: { id: number; url: string; type: "image" | "video" }) => ({
            id: media.id,
            source: media.url,
            type: media.type,
          }),
        ) || []
      );
    });
  }, [postData]);

  useEffect(() => {
    return () => {
      previewMedia.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.source);
        }
      });
    };
  }, [previewMedia]);

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

    const nextMedia = files.map((file) => ({
      source: URL.createObjectURL(file),
      type: (file.type.startsWith("video/") ? "video" : "image") as
        | "image"
        | "video",
      file,
      isObjectUrl: true,
    }));

    setPreviewMedia((previous) => [...previous, ...nextMedia]);

    event.target.value = "";
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    setPreviewMedia((previous) => {
      const next = previous.filter((_, index) => index !== indexToRemove);
      const removed = previous[indexToRemove];

      if (removed?.id) {
        setRemovedMediaIds((prev) =>
          prev.includes(removed.id!) ? prev : [...prev, removed.id!],
        );
      }

      if (removed?.isObjectUrl) {
        URL.revokeObjectURL(removed.source);
      }

      return next;
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setPostText((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      postText.substring(0, start) + emoji + postText.substring(end);
    setPostText(newText);

    // Focus textarea and set cursor after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleSubmit = async () => {
    const trimmedText = postText.trim();
    const newMediaCount = previewMedia.filter((item) => item.file).length;
    if (
      !trimmedText &&
      newMediaCount === 0 &&
      removedMediaIds.length === 0 &&
      !postData?.id
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("description", textToHtml(postText));
    formData.append("visibility", "groups");
    formData.append("group_ids[]", String(groupId || groupsId));
    previewMedia.forEach((media) => {
      if (media.file) {
        formData.append("media[]", media.file);
      }
    });
    formData.append("who_can_comment", commentControl);

    if (postData?.id && removedMediaIds.length > 0) {
      removedMediaIds.forEach((id) => {
        formData.append("remove_media_ids[]", String(id));
      });
    }

    try {
      const response = postData?.id
        ? await updateGroupPost({
            id: postData.id,
            groupId: groupId || groupsId,
            body: formData,
          }).unwrap()
        : await createPost(formData).unwrap();

      toast.success(
        response.message ||
          (postData?.id
            ? "Post updated successfully"
            : "Post created successfully"),
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("post-created"));
      }
      dispatch(resetPostComposeState());
      previewMedia.forEach((item) => {
        if (item.isObjectUrl) {
          URL.revokeObjectURL(item.source);
        }
      });
      setPostText("");
      setPreviewMedia([]);
      setRemovedMediaIds([]);
      setOpen(false);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          (postData?.id ? "Failed to update post" : "Failed to create post"),
      );
      console.error(error);
    }
  };

  const commentLabel =
    commentControl === "connections"
      ? "Comments: Members"
      : commentControl === "no_one"
        ? "Comments: No one"
        : "Comments: Anyone";

  return (
    <RootDialog
      open={open}
      setOpen={(nextOpen) => {
        if (!nextOpen) setShowSettings(false);
        setOpen(nextOpen);
      }}
      className="overflow-visible"
    >
      {showSettings ? (
        <section className="flex flex-col max-h-[85dvh] py-4">
          <div className="flex items-center gap-2 border-b border-borderColor px-4 pb-3 pr-12">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              aria-label="Back to group post"
              className="rounded-full p-1.5 text-descriptionColor hover:bg-gray-100 transition cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <h3 className="text-lg font-semibold text-headerColor">
              Post Setting
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-descriptionColor mb-3">
                Select who can see your posts
              </h4>
              <div className="space-y-1.5">
                {[
                  { value: "anyone" as const, label: "Anyone", icon: GlobalIcon },
                  {
                    value: "members" as const,
                    label: "Members only",
                    icon: GroupUserIcon,
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = visibilityOption === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setVisibilityOption(opt.value)}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-left hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bgColor text-descriptionColor">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="text-sm font-medium text-headerColor">
                          {opt.label}
                        </span>
                      </div>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          active ? "border-primaryColor" : "border-grayColor1"
                        }`}
                      >
                        {active && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primaryColor" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-descriptionColor mb-3">
                Comment Control
              </h4>
              <div className="space-y-1.5">
                {[
                  { value: "anyone" as const, label: "Anyone", icon: GlobalIcon },
                  {
                    value: "connections" as const,
                    label: "Members",
                    icon: MultiUserIcon,
                  },
                  { value: "no_one" as const, label: "No one", icon: BanIcon },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = commentControl === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCommentControl(opt.value)}
                      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 text-left hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bgColor text-descriptionColor">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <span className="text-sm font-medium text-headerColor">
                          {opt.label}
                        </span>
                      </div>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                          active ? "border-primaryColor" : "border-grayColor1"
                        }`}
                      >
                        {active && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primaryColor" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 border-t border-borderColor px-4 pt-3.5">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="rounded-full bg-bgLightColor cursor-pointer px-4 py-1.5 text-sm font-medium text-descriptionColor hover:bg-grayColor2 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="rounded-full bg-buttonColor cursor-pointer px-5 py-1.5 text-sm font-semibold text-whiteColor hover:bg-buttonHover transition"
            >
              Done
            </button>
          </div>
        </section>
      ) : (
      <section className="relative flex min-h-[360px] sm:min-h-[420px] max-h-[88dvh] flex-col overflow-visible px-4 pb-4 pt-4 md:px-6 md:pb-5 md:pt-5 bg-white rounded-xl">
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
            <div className="h-12 w-12 border border-borderColor shrink-0 overflow-hidden rounded-full">
              <Image
                src={data?.user?.profile_image_url || "/empty_user.jpg"}
                alt="Vin Intiny"
                width={150}
                height={140}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div>
              <h3 className="text-base font-semibold leading-6 text-headerColor">
                {`${data?.user?.first_name || ""} ${data?.user?.last_name || ""}`.trim() ||
                  "Vin Intini"}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-borderColor bg-gray-50/70 px-2.5 py-0.5 text-xs font-medium text-descriptionColor hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {visibilityOption === "anyone" ? (
                    <GlobalIcon className="h-3 w-3 text-gray-500" />
                  ) : (
                    <GroupUserIcon className="h-3 w-3 text-primaryColor" />
                  )}
                  <span>
                    {visibilityOption === "anyone" ? "Anyone" : "Members only"}
                  </span>
                  <MenueArrowDownIcon className="h-2.5 w-2.5 text-gray-500" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-borderColor bg-gray-50/70 px-2.5 py-0.5 text-xs font-medium text-descriptionColor hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3 text-gray-500" />
                  <span>{commentLabel}</span>
                  <MenueArrowDownIcon className="h-2.5 w-2.5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={(event) => {
              setPostText(event.target.value);
              const el = textareaRef.current;
              if (el) {
                el.style.height = "auto";
                const nextH = Math.max(160, Math.min(el.scrollHeight, 280));
                el.style.height = `${nextH}px`;
              }
            }}
            placeholder="What do you want to talk about?"
            className="w-full resize-none border-none bg-transparent p-0 text-[16px] leading-7 text-headerColor focus:outline-none focus:ring-0"
            style={{
              minHeight: "160px",
              maxHeight: "280px",
              fontFamily:
                '"Twemoji Country Flags", var(--font-segoe-ui), "Segoe UI", sans-serif',
            }}
          />
          {previewMedia.length > 0 && (
            <div
              className={`mb-3 mt-3 grid ${
                previewMedia.length == 1
                  ? "grid-cols-1"
                  : previewMedia.length == 2
                    ? "grid-cols-2"
                    : "grid-cols-3"
              } gap-2`}
            >
              {previewMedia.slice(0, 3).map((media, index) => {
                const hiddenCount = previewMedia.length - 3;
                const showOverlay = index === 2 && hiddenCount > 0;
                return media.type === "video" ? (
                  <div
                    key={media.source || `media-${index}`}
                    className="relative overflow-hidden rounded-xl border border-borderColor bg-black max-h-72"
                  >
                    <video
                      src={media.source}
                      controls
                      playsInline
                      preload="metadata"
                      className="max-h-72 w-full object-contain"
                    />
                    {showOverlay && (
                      <div className="absolute inset-0 w-full text-center leading-[100%] flex items-center justify-center bg-black/50 text-sm font-semibold text-whiteColor">
                        +{hiddenCount} more
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute right-2 top-2 rounded-full cursor-pointer bg-black/70 hover:bg-black/90 p-1.5 text-xs text-white transition-colors"
                      aria-label={`Remove media ${index + 1}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    key={media.source || `media-${index}`}
                    className={`relative overflow-hidden rounded-xl border border-borderColor bg-gray-50 ${
                      previewMedia.length === 1
                        ? "max-h-72 sm:max-h-80"
                        : previewMedia.length === 2
                          ? "h-44 sm:h-52"
                          : "h-32 sm:h-40"
                    }`}
                  >
                    <Image
                      src={media.source}
                      alt={`Selected media ${index + 1}`}
                      width={1200}
                      height={400}
                      unoptimized
                      className={`w-full ${
                        previewMedia.length === 1
                          ? "max-h-72 sm:max-h-80 h-auto object-contain"
                          : "h-full object-cover"
                      }`}
                    />
                    {showOverlay && (
                      <div className="absolute inset-0 w-full text-center leading-[100%] flex items-center justify-center bg-black/50 text-sm font-semibold text-whiteColor">
                        +{hiddenCount} more
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 hover:bg-black/90 cursor-pointer p-1.5 text-xs text-white transition-colors"
                      aria-label={`Remove media ${index + 1}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-borderColor pt-3 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <SmartEmojiPicker
                onEmojiSelect={handleEmojiSelect}
                iconClassName="w-5 h-5 text-descriptionColor cursor-pointer hover:opacity-80"
                direction="up"
                theme="light"
                height={290}
                width={310}
              />

              <button
                type="button"
                className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-descriptionColor hover:opacity-80 transition"
                aria-label="Add image"
                onClick={handleMediaButtonClick}
              >
                <ImageUploadIcon className="w-5 h-5 text-descriptionColor" />
              </button>

              <button
                type="button"
                className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer text-descriptionColor hover:opacity-80 transition"
                aria-label="Add video"
                onClick={handleMediaButtonClick}
              >
                <PlayIcon className="h-5 w-5 text-descriptionColor" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                (!postText.trim() &&
                  previewMedia.filter((item) => item.file).length === 0 &&
                  removedMediaIds.length === 0 &&
                  !postData?.id) ||
                isLoading ||
                isUpdating
              }
              className="flex h-9 cursor-pointer items-center gap-2 rounded-full bg-buttonColor px-5 text-[14px] font-semibold text-white hover:bg-buttonColor/90 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 transition"
            >
              {isLoading || isUpdating ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
              {postData?.id ? "Update" : "Post"}
            </button>
          </div>
        </footer>
      </section>
      )}
    </RootDialog>
  );
}

export default GroupPostCreateDialog;
