import {
  useCommentLikePostMutation,
  useReplyToggleLikeByIdMutation,
} from "@/feature/slice/post/likeSlice";
import { formatPostDate } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import emptyImage from "@/public/empty_user.jpg";
export default function CommentRow({
  depth = 0,
  showReply = false,
  item,
  onReply,
  onToggleReplies,
  isRepliesOpen,
}: {
  depth?: number;
  showReply?: boolean;
  item: any;
  onReply?: (commentId: number, userName: string) => void;
  onToggleReplies?: (commentId: number) => void;
  isRepliesOpen?: boolean;
}) {
  const [commentLikePost] = useCommentLikePostMutation();
  const [replyToggleLikeById] = useReplyToggleLikeByIdMutation();
  const [isLiked, setIsLiked] = useState(Boolean(item?.liked_by_me));
  const likedByMe = Boolean(item?.liked_by_me);
  const likesCount = Math.max(
    0,
    (item?.like_count || 0) + (isLiked === likedByMe ? 0 : isLiked ? 1 : -1),
  );
  const handleLikeComment = async () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    try {
      const response = await commentLikePost({ commentId: item?.id });
      toast.success(
        response?.data?.message || "Comment like toggled successfully",
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to like the comment. Please try again.");
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
      console.log(error);
      toast.error("Failed to like the reply. Please try again.");
    }
  };
  return (
    <div className={`${depth > 0 ? "ml-6  pl-5" : " "} relative`}>
      {depth > 0 && (
        <div className="pointer-events-none absolute -left-2.5 -top-4 h-9 w-7 rounded-bl-2xl border-l border-b border-borderColor" />
      )}
      <div className="flex items-start  gap-2.5">
        <div className="h-8 w-8 border  overflow-hidden rounded-full">
          <Image
            src={item?.user?.profile_image || emptyImage}
            alt="Profile"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm lg:text-[15px] leading-[140%] font-semibold text-headerColor">
            {item?.user?.name || "Profile Name"}
          </h4>
          <p className=" line-clamp-1 text-[13px] wf font-normal text-descriptionColor">
            {item?.user?.title ||
              "Title (whether its a concise or long title, all the text will be in single line. Truncate the sentence i...)"}
          </p>
        </div>
        <p className="ml-auto shrink-0 font-semibold w-fit text-[14px] leading-5 text-descriptionColor">
          {formatPostDate(item?.comment_time || item?.reply_time || new Date().toISOString())}
        </p>
      </div>

      <p className="mt-4 pl-10 text-base font-normal leading-[150%] text-descriptionColor">
        {item?.comment || item?.reply || "This is a sample comment."}
      </p>

      {depth == 0 ? (
        <div className="mt-4 pl-10 flex items-center gap-3 text-[14px] font-semibold text-descriptionColor">
          <button
            type="button"
            onClick={handleLikeComment}
            className={`${isLiked ? " text-primaryColor" : ""} cursor-pointer text-descriptionColor hover:opacity-80`}
          >
            Like • {likesCount || 0}
          </button>

          <>
            <span className="text-headerColor/45">|</span>

            <button
              type="button"
              onClick={() => onReply?.(item?.id, item?.user?.name)}
              aria-expanded={isRepliesOpen}
              className="cursor-pointer text-descriptionColor hover:opacity-80"
            >
              Reply • {item?.replies_count || 0}
            </button>
          </>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleReplyLikeComment}
          className={`${isLiked ? " text-primaryColor" : ""} cursor-pointer text-descriptionColor mt-4 font-semibold text-sm pl-10 hover:opacity-80`}
        >
          Like • {likesCount || 0}
        </button>
      )}
    </div>
  );
}
