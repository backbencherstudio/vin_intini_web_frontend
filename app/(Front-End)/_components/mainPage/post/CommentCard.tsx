import {
  useCommentLikePostMutation,
  useReplyToggleLikeByIdMutation,
} from "@/feature/slice/post/likeSlice";
import { formatPostDate } from "@/lib/utils";
import emptyImage from "@/public/empty_user.jpg";
import { DeleteIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CommentDeleteDialog from "./CommentDeleteDialog";
import CommentReplyDeleteDialog from "./CommentReplyDelete";
import CommentReplyLikeList from "./CommentReplyLikeList";
import CommentLikeList from "./ReplyLikeListDialog";
export default function CommentRow({
  depth = 0,
  showReply = false,
  item,
  parentCommentId,
  onReply,
  onToggleReplies,
  isRepliesOpen,
  isHighlighted = false,
  highlightLabel,
}: {
  depth?: number;
  showReply?: boolean;
  item: any;
  parentCommentId?: number;
  onReply?: (
    commentId: number,
    userName: string,
    targetUserId?: number,
    targetReplyId?: number,
  ) => void;
  onToggleReplies?: (commentId: number) => void;
  isRepliesOpen?: boolean;
  isHighlighted?: boolean;
  highlightLabel?: string;
}) {
  const [highlightActive, setHighlightActive] = useState(isHighlighted);
  const [imgSrc, setImgSrc] = useState<any>(
    item?.user?.profile_image || emptyImage,
  );
  const [commentLikePost] = useCommentLikePostMutation();
  const [likeListOpen, setLikeListOpen] = useState(false);
  const [commentDeleteOpen, setCommentDeleteOpen] = useState(false);
  const [commentReplyDeleteOpen, setCommentReplyDeleteOpen] = useState(false);
  const [replyLikeListOpen, setReplyLikeListOpen] = useState(false);
  const [replyToggleLikeById] = useReplyToggleLikeByIdMutation();
  const [isLiked, setIsLiked] = useState(Boolean(item?.liked_by_me));
  const likedByMe = Boolean(item?.liked_by_me);
  const likesCount = Math.max(
    0,
    (item?.like_count || 0) + (isLiked === likedByMe ? 0 : isLiked ? 1 : -1),
  );

  useEffect(() => {
    setImgSrc(item?.user?.profile_image || emptyImage);
  }, [item?.user?.profile_image]);

  useEffect(() => {
    if (isHighlighted) {
      setHighlightActive(true);
      const timer = setTimeout(() => {
        setHighlightActive(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);
  const handleLikeComment = async () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    try {
      const response = await commentLikePost({ commentId: item?.id });
      toast.success(
        response?.data?.message || "Comment like toggled successfully",
      );
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to like the comment. Please try again.",
      );
    }
  };
  const handleReplyLikeComment = async () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    try {
      const response = await replyToggleLikeById({ commentId: item?.id });
      toast.success(
        response?.data?.message || "Reply like toggled successfully",
      );
    } catch (error) {
      setIsLiked(!newLikedStatus);

      toast.error(
        error?.data?.message || "Failed to like the reply. Please try again.",
      );
    }
  };

  const renderCommentContent = () => {
    const rawText = (item?.comment || item?.reply || "").trim();
    const replyToUser = item?.reply_to_user;

    // Check if raw text starts with @[Some Name]
    const mentionMatch = rawText.match(/^(@[^\s]+(?:\s+[^\s]+)?)\s*(.*)$/);

    if (mentionMatch) {
      const mention = mentionMatch[1];
      const remainingText = mentionMatch[2];
      const targetIdentifier = replyToUser?.username || replyToUser?.id;
      const profileHref = targetIdentifier
        ? `/mu/profile/${targetIdentifier}`
        : "#";

      return (
        <>
          <Link
            href={profileHref}
            className="inline-block font-semibold text-primaryColor mr-1.5"
          >
            {mention}
          </Link>
          {remainingText}
        </>
      );
    }

    if (replyToUser?.name) {
      const targetIdentifier = replyToUser?.username || replyToUser?.id;
      return (
        <>
          <Link
            href={`/mu/profile/${targetIdentifier}`}
            className="inline-block font-semibold text-primaryColor mr-1.5"
          >
            @{replyToUser.name}
          </Link>
          {rawText}
        </>
      );
    }

    return rawText;
  };

  const userProfileHref = item?.industry_id
    ? `/mu/industry/${item?.industry_id}`
    : `/mu/profile/${item?.user?.username || item?.user?.id}`;

  return (
    <div
      id={depth > 0 ? `reply-${item?.id}` : `comment-${item?.id}`}
      className={`${
        depth > 0 ? "ml-6 pl-5" : ""
      } relative -mx-2 px-2 py-1.5 rounded-xl transition-colors duration-1000 ease-out ${
        highlightActive ? "bg-primaryColor/12" : "bg-transparent"
      }`}
    >
      {depth > 0 && (
        <div className="pointer-events-none absolute -left-2.5 -top-4 h-9 w-7 rounded-bl-2xl border-l border-b border-borderColor" />
      )}
      <div className="flex items-start gap-2.5">
        <Link
          href={userProfileHref}
          className="h-8 w-8 border border-borderColor/60 overflow-hidden rounded-full shrink-0 bg-slate-100 block"
        >
          <Image
            src={imgSrc}
            alt="Profile"
            width={32}
            height={32}
            unoptimized
            onError={() => setImgSrc("/empty_user.jpg")}
            className="h-full w-full object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={userProfileHref}
              className="text-sm lg:text-[15px] leading-[140%] font-semibold text-headerColor"
            >
              {item?.user?.name || "Profile Name"}
            </Link>
          </div>
          <p className="line-clamp-1 text-[13px] wf font-normal text-descriptionColor">
            {item?.user?.title || ""}
          </p>
        </div>
        <p className="ml-auto shrink-0 font-semibold w-fit text-[14px] leading-5 text-descriptionColor">
          {formatPostDate(
            item?.comment_time || item?.reply_time || new Date().toISOString(),
          )}
        </p>
      </div>

      <div className="mt-4 pl-10">
        <p className="text-base font-normal leading-[150%] text-descriptionColor break-words whitespace-pre-line">
          {renderCommentContent()}
        </p>
        {item?.image_url && (
          <div className="mt-2 h-50 w-50 border overflow-hidden rounded-sm">
            <Image
              src={item?.image_url || emptyImage}
              alt="Attachment"
              width={132}
              height={132}
              priority
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>

      {depth === 0 ? (
        <div className="mt-4 pl-10 flex items-center gap-3 text-[14px] font-semibold text-descriptionColor">
          <div className="text-descriptionColor gap-1 flex items-center">
            <button
              type="button"
              onClick={handleLikeComment}
              className={`${isLiked ? "text-primaryColor" : ""} cursor-pointer hover:opacity-80`}
            >
              Like •
            </button>
            <button
              onClick={() => setLikeListOpen(true)}
              className="cursor-pointer"
            >
              {likesCount || 0}
            </button>
          </div>

          <span className="text-headerColor/45">|</span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                onReply?.(item?.id, item?.user?.name, item?.user?.id);
              }}
              className="cursor-pointer text-descriptionColor hover:opacity-80"
            >
              Reply
            </button>
            {Boolean(item?.replies_count && item.replies_count > 0) && (
              <>
                <span className="text-headerColor/30">•</span>
                <button
                  type="button"
                  onClick={() => onToggleReplies?.(item?.id)}
                  aria-expanded={isRepliesOpen}
                  className={`cursor-pointer hover:underline flex items-center gap-1 ${
                    isRepliesOpen
                      ? "text-primaryColor font-semibold"
                      : "text-descriptionColor hover:text-primaryColor"
                  }`}
                >
                  {isRepliesOpen
                    ? "Hide replies"
                    : `${item.replies_count} ${item.replies_count === 1 ? "reply" : "replies"}`}
                </button>
              </>
            )}
          </div>
          {item?.can_delete && (
            <>
              <span className="text-headerColor/45">|</span>
              <button
                className="cursor-pointer"
                onClick={() => setCommentDeleteOpen(true)}
                aria-label="Delete comment"
              >
                <DeleteIcon className="text-redColor w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="text-descriptionColor flex items-center gap-3 text-sm font-semibold mt-4 pl-10">
          <div className="gap-1 flex items-center">
            <button
              type="button"
              onClick={handleReplyLikeComment}
              className={`${isLiked ? "text-primaryColor" : ""} cursor-pointer hover:opacity-80`}
            >
              Like •
            </button>
            <button
              onClick={() => setReplyLikeListOpen(true)}
              className="cursor-pointer"
            >
              {likesCount || 0}
            </button>
          </div>

          <span className="text-headerColor/45">|</span>

          <button
            type="button"
            onClick={() =>
              onReply?.(
                parentCommentId || item?.comment_id || item?.id,
                item?.user?.name,
                item?.user?.id,
                item?.id,
              )
            }
            className="cursor-pointer text-descriptionColor hover:opacity-80"
          >
            Reply
          </button>

          {item?.can_delete && (
            <>
              <span className="text-headerColor/45">|</span>
              <button
                className="cursor-pointer"
                onClick={() => setCommentReplyDeleteOpen(true)}
                aria-label="Delete reply"
              >
                <DeleteIcon className="text-redColor w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}
      {likeListOpen && (
        <CommentLikeList
          open={likeListOpen}
          setOpen={setLikeListOpen}
          commentId={item?.id}
        />
      )}
      {replyLikeListOpen && (
        <CommentReplyLikeList
          open={replyLikeListOpen}
          setOpen={setReplyLikeListOpen}
          commentId={item?.id}
        />
      )}
      {commentDeleteOpen && (
        <CommentDeleteDialog
          open={commentDeleteOpen}
          setOpen={setCommentDeleteOpen}
          commentId={item?.id}
        />
      )}
      {commentReplyDeleteOpen && (
        <CommentReplyDeleteDialog
          open={commentReplyDeleteOpen}
          setOpen={setCommentReplyDeleteOpen}
          commentId={item?.id}
        />
      )}
    </div>
  );
}
