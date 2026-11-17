import CommentRowSkeleton from "@/components/reusable/All Skleton/PostCommentSkleton";
import { useGetReplyListByCommentIdQuery } from "@/feature/slice/post/commentSlice";
import emptyImage from "@/public/empty_user.jpg";
import Image from "next/image";
import { useEffect, useRef } from "react";
import CommentBoxArea from "./CommentBoxArea";
import CommentRow from "./CommentCard";

export function CommentReplyList({
  commentId,
  postId,
  currentUserProfile,
  activeReplyTarget,
  onReply,
  onCancelReply,
  onReplySuccess,
  targetReplyId,
  onLastReplyTopChange,
}: {
  commentId: number;
  postId?: number;
  currentUserProfile?: any;
  activeReplyTarget?: {
    commentId: number;
    userName: string;
    targetUserId?: number;
    targetReplyId?: number;
  } | null;
  onReply?: (
    commentId: number,
    userName: string,
    targetUserId?: number,
    targetReplyId?: number,
  ) => void;
  onCancelReply?: () => void;
  onReplySuccess?: () => void;
  targetReplyId?: string | number | null;
  onLastReplyTopChange?: (lastTopInViewport: number | null) => void;
}) {
  const { data: replyData, isLoading } = useGetReplyListByCommentIdQuery(
    targetReplyId
      ? { commentId, targetReplyId: Number(targetReplyId) }
      : commentId,
  );
  const listRef = useRef<HTMLDivElement | null>(null);

  const replies = replyData?.data || [];
  const isInputActive = Boolean(
    activeReplyTarget && activeReplyTarget.commentId === commentId,
  );
  const targetReplyIdToMatch = activeReplyTarget?.targetReplyId;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!replies.length && !isInputActive) {
      onLastReplyTopChange?.(null);
      return;
    }

    const measureLastReplyTop = () => {
      const allRows = listRef.current?.querySelectorAll("[data-reply-row]");
      if (!allRows || !allRows.length) {
        onLastReplyTopChange?.(null);
        return;
      }

      const lastReplyRow = allRows[allRows.length - 1] as HTMLDivElement;
      onLastReplyTopChange?.(lastReplyRow.getBoundingClientRect().top);
    };

    const frameId = requestAnimationFrame(measureLastReplyTop);
    window.addEventListener("resize", measureLastReplyTop);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", measureLastReplyTop);
    };
  }, [isLoading, replies.length, isInputActive, onLastReplyTopChange]);

  useEffect(() => {
    if (!targetReplyId || isLoading || !replies.length) {
      return;
    }
    const timer = setTimeout(() => {
      const el = document.getElementById(`reply-${targetReplyId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [targetReplyId, isLoading, replies.length]);

  if (isLoading) {
    return (
      <div className="relative mt-6 space-y-3">
        {[1, 2].map((i) => (
          <CommentRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!replies.length && !isInputActive) {
    return null;
  }

  // Helper to render the inline input box
  const renderInlineInputBox = () => (
    <div className="ml-6 pl-5 relative mt-3" data-reply-row>
      <div className="pointer-events-none absolute -left-2.5 -top-4 h-9 w-7 rounded-bl-2xl border-l border-b border-borderColor" />
      <div className="flex items-start gap-2.5">
        <div className="h-8 w-8 border border-borderColor/60 overflow-hidden rounded-full shrink-0 bg-slate-100">
          <Image
            src={currentUserProfile?.profile_image_url || emptyImage}
            alt="Current User"
            width={32}
            height={32}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <CommentBoxArea
            postId={postId}
            parentId={commentId}
            replyToUserId={activeReplyTarget?.targetUserId}
            replyToReplyId={activeReplyTarget?.targetReplyId}
            replyingToUserName={activeReplyTarget?.userName}
            placeholder={`Write a reply to ${activeReplyTarget?.userName}...`}
            autoFocus={true}
            isInline={true}
            onCancelReply={onCancelReply}
            onSuccess={onReplySuccess}
          />
        </div>
      </div>
    </div>
  );

  // Check if active target matches any reply in the list
  const isTargetReplyInList = targetReplyIdToMatch
    ? replies.some((r: any) => Number(r.id) === Number(targetReplyIdToMatch))
    : false;

  return (
    <div
      ref={listRef}
      className="relative mt-4 space-y-3.5"
    >
      {replies.map((reply: any) => {
        const isTarget = targetReplyId
          ? String(reply.id) === String(targetReplyId)
          : false;
        const isInputDirectlyUnderThisReply =
          isInputActive &&
          targetReplyIdToMatch &&
          Number(reply.id) === Number(targetReplyIdToMatch);

        return (
          <div key={reply.id} className="space-y-3.5">
            <div data-reply-row>
              <CommentRow
                item={reply}
                depth={1}
                parentCommentId={commentId}
                onReply={onReply}
                isHighlighted={isTarget}
                highlightLabel="Highlighted reply"
              />
            </div>

            {/* If user clicked Reply on this specific reply, open input box right under it */}
            {isInputDirectlyUnderThisReply && renderInlineInputBox()}
          </div>
        );
      })}

      {/* If replying to the root comment or target reply is not specifically matched, open input box at the bottom */}
      {isInputActive && (!targetReplyIdToMatch || !isTargetReplyInList) && (
        renderInlineInputBox()
      )}
    </div>
  );
}
