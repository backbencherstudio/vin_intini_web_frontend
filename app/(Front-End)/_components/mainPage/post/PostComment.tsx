import { } from "@/components/ui/accordion";

import CommentRowSkeleton from "@/components/reusable/All Skleton/PostCommentSkleton";
import {
  useGetAllCommentListByPostIdQuery,
  useCheckCommentTargetQuery,
} from "@/feature/slice/post/commentSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { PostFeedType } from "@/lib/type";
import emptyImage from "@/public/empty_user.jpg";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CommentBoxArea from "./CommentBoxArea";
import CommentRow from "./CommentCard";
import { CommentReplyList } from "./CommentReplyList";

type CommentItem = {
  id: number;
  depth?: number;
  message?: string;
  showReply?: boolean;
  replyComments?: CommentItem[];
};

function PostComment({
  post,
  targetCommentId,
  targetReplyId,
}: {
  post?: PostFeedType;
  targetCommentId?: string | number | null;
  targetReplyId?: string | number | null;
}) {
  const CONNECTOR_START_OFFSET = 44;
  const limit = 5;
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [deletedNotice, setDeletedNotice] = useState<{
    type?: string;
    message?: string;
  } | null>(null);

  const { data } = useGetUserProfileQuery("user");

  // Check target comment/reply existence and resolve hierarchy
  const { data: targetStatus } = useCheckCommentTargetQuery(
    {
      post_id: post?.id,
      comment_id: targetCommentId || undefined,
      reply_id: targetReplyId || undefined,
    },
    { skip: !targetCommentId && !targetReplyId },
  );

  const resolvedTargetCommentId =
    targetStatus?.comment_id || targetCommentId || null;
  const targetParam = resolvedTargetCommentId
    ? `&target_comment_id=${resolvedTargetCommentId}`
    : "";

  const { data: commentData, isLoading: isCommentLoading } =
    useGetAllCommentListByPostIdQuery(
      { query: `${post?.id}?page=${page}&per_page=${limit}${targetParam}` },
      { skip: !post?.id },
    );
  const commentContainerRefs = useRef<Record<number, HTMLDivElement | null>>(
    {},
  );

  const [activeReplyTarget, setActiveReplyTarget] = useState<{
    commentId: number;
    userName: string;
    targetUserId?: number;
    targetReplyId?: number;
  } | null>(null);
  const [openReplyCommentId, setOpenReplyCommentId] = useState<number | null>(
    null,
  );
  const [replyLineHeights, setReplyLineHeights] = useState<
    Record<number, number>
  >({});

  // Synchronize target status (deleted notice or expand replies)
  useEffect(() => {
    if (!targetStatus) return;

    if (targetStatus.exists === false) {
      setDeletedNotice({
        type: targetStatus.type,
        message: targetStatus.message,
      });
      toast.error(
        targetStatus.message ||
          "The comment or reply you're looking for is no longer available.",
      );
    } else if (targetStatus.exists === true) {
      if (targetStatus.type === "reply" && targetStatus.comment_id) {
        setOpenReplyCommentId(Number(targetStatus.comment_id));
      }
    }
  }, [targetStatus]);

  // Initial immediate expansion if targetCommentId and targetReplyId are present
  useEffect(() => {
    if (targetReplyId && targetCommentId) {
      setOpenReplyCommentId(Number(targetCommentId));
    }
  }, [targetCommentId, targetReplyId]);

  // Smooth scroll for top-level highlighted comment
  useEffect(() => {
    if (
      !resolvedTargetCommentId ||
      targetReplyId ||
      targetStatus?.type === "reply" ||
      isCommentLoading ||
      !comments.length
    ) {
      return;
    }

    const timer = setTimeout(() => {
      const el = document.getElementById(`comment-${resolvedTargetCommentId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [
    resolvedTargetCommentId,
    targetReplyId,
    targetStatus?.type,
    isCommentLoading,
    comments.length,
  ]);

  const handleReply = (
    commentId: number,
    userName: string,
    targetUserId?: number,
    targetReplyId?: number,
  ) => {
    setActiveReplyTarget({
      commentId,
      userName,
      targetUserId,
      targetReplyId,
    });
    setOpenReplyCommentId(commentId);
  };

  const handleToggleReplies = (commentId: number) => {
    setOpenReplyCommentId((previous) => {
      if (previous === commentId) {
        if (activeReplyTarget?.commentId === commentId) {
          setActiveReplyTarget(null);
        }
        return null;
      }
      return commentId;
    });
  };

  const handleCancelReply = () => {
    setActiveReplyTarget(null);
  };

  const handleLastReplyTopChange = useCallback(
    (commentId: number, lastTopInViewport: number | null) => {
      const commentContainer = commentContainerRefs.current[commentId];

      const nextHeight =
        !commentContainer || lastTopInViewport === null
          ? 0
          : Math.max(
              lastTopInViewport -
                commentContainer.getBoundingClientRect().top -
                CONNECTOR_START_OFFSET,
              0,
            );

      setReplyLineHeights((previous) => {
        if (previous[commentId] === nextHeight) {
          return previous;
        }

        return {
          ...previous,
          [commentId]: nextHeight,
        };
      });
    },
    [CONNECTOR_START_OFFSET],
  );

  useEffect(() => {
    const newItems: CommentItem[] = commentData?.data || [];

    if (!newItems.length) return;

    setComments((prev) => {
      if (page === 1) return newItems;

      const existingIds = new Set(prev.map((c) => c.id));
      const merged = [...prev];

      newItems.forEach((it) => {
        if (!existingIds.has(it.id)) merged.push(it);
      });

      return merged;
    });
  }, [commentData, page]);


  const totalComments = commentData?.pagination?.total || 0;
  const loadedComments = comments.length || commentData?.data?.length || 0;
  const hasMoreComments = totalComments > loadedComments;
  const showToggleButton = totalComments > limit;
  const buttonLabel = isExpanded ? "See less comments" : "See all comments";

  const handleToggleComments = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setPage((previous) => previous + 1);
      return;
    }

    setIsExpanded(false);
    setPage(1);
    setComments([]);
    setOpenReplyCommentId(null);
    setActiveReplyTarget(null);
  };

  return (
    <section className="border-t border-borderColor comment-section py-4 px-2.5 md:px-3">
      {deletedNotice && (
        <div className="mb-4 rounded-xl border border-amber-200/80 bg-amber-50/90 p-3.5 md:p-4 text-amber-900 flex items-start gap-3 shadow-xs animate-in fade-in duration-300">
          <div className="rounded-full bg-amber-100 p-1.5 text-amber-700 shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-amber-950 text-sm">
              {deletedNotice.type === "reply"
                ? "Reply unavailable"
                : "Comment unavailable"}
            </p>
            <p className="text-amber-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
              {deletedNotice.message ||
                `This ${deletedNotice.type === "reply" ? "reply" : "comment"} is no longer available because it has been deleted by its author or removed.`}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={data?.user?.profile_image_url || emptyImage}
            alt="Current user"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <CommentBoxArea
            postId={post?.id}
            placeholder={`Comment as ${data?.user?.first_name || "User"}...`}
          />
        </div>
      </div>

      <div className="mt-4 space-y-4 lg:space-y-6 ">
        {isCommentLoading && page === 1 ? (
          <div className="w-full space-y-3">
            {[...Array(3)].map((_, index) => (
              <div className="border-b " key={index}>
                <CommentRowSkeleton />
              </div>
            ))}
          </div>
        ) : (
          (comments || commentData?.data || []).map((item) => {
            const isTargetComment =
              !targetReplyId &&
              targetStatus?.type !== "reply" &&
              resolvedTargetCommentId &&
              String(item.id) === String(resolvedTargetCommentId);

            return (
              <div
                key={item?.id}
                ref={(element) => {
                  commentContainerRefs.current[item.id] = element;
                }}
                style={
                  {
                    "--reply-line-height": `${replyLineHeights[item.id] || 0}px`,
                  } as CSSProperties
                }
                className={`relative border-b-0 after:absolute after:left-3.5 after:top-11 after:w-px after:bg-borderColor after:content-[''] ${openReplyCommentId === item.id ? "after:h-(--reply-line-height)" : "after:h-0"}`}
              >
                <CommentRow
                  item={item}
                  depth={0}
                  onReply={handleReply}
                  onToggleReplies={handleToggleReplies}
                  isRepliesOpen={openReplyCommentId === item.id}
                  isHighlighted={Boolean(isTargetComment)}
                  highlightLabel="Highlighted comment"
                />
                {openReplyCommentId === item.id && (
                  <div className="">
                    <CommentReplyList
                      commentId={item.id}
                      postId={post?.id}
                      currentUserProfile={data?.user}
                      activeReplyTarget={activeReplyTarget}
                      onReply={handleReply}
                      onCancelReply={handleCancelReply}
                      onReplySuccess={handleCancelReply}
                      targetReplyId={
                        targetReplyId ||
                        (targetStatus?.type === "reply"
                          ? targetStatus?.reply_id
                          : null)
                      }
                      onLastReplyTopChange={(lastTopInViewport) =>
                        handleLastReplyTopChange(item.id, lastTopInViewport)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {showToggleButton ? (
        <button
          type="button"
          onClick={handleToggleComments}
          disabled={isCommentLoading}
          className="mt-6 text-[16px] font-semibold text-headerColor hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonLabel}
        </button>
      ) : null}
    </section>
  );
}

export default PostComment;
