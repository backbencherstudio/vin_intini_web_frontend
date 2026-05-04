import {} from "@/components/ui/accordion";

import { useGetAllCommentListByPostIdQuery } from "@/feature/slice/post/commentSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { PostFeedType } from "@/lib/type";
import Image from "next/image";
import { type CSSProperties, useRef, useState } from "react";

import CommentRowSkeleton from "@/components/reusable/All Skleton/PostCommentSkleton";
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

function PostComment({ post }: { post?: PostFeedType }) {
  const CONNECTOR_START_OFFSET = 44;
  const { data } = useGetUserProfileQuery("user");
  const { data: commentData, isLoading: isCommentLoading } =
    useGetAllCommentListByPostIdQuery(post?.id);
  const commentContainerRefs = useRef<Record<number, HTMLDivElement | null>>(
    {},
  );
  const [parentId, setParentId] = useState<number | null>(null);
  const [openReplyCommentId, setOpenReplyCommentId] = useState<number | null>(
    null,
  );
  const [replyLineHeights, setReplyLineHeights] = useState<
    Record<number, number>
  >({});
  const [replyingToUserName, setReplyingToUserName] = useState<string | null>(
    null,
  );

  const handleReply = (commentId: number, userName: string) => {
    setParentId(commentId);
    setReplyingToUserName(userName);
    setOpenReplyCommentId(commentId);
  };

  const handleToggleReplies = (commentId: number) => {
    setOpenReplyCommentId((previous) =>
      previous === commentId ? null : commentId,
    );
  };

  const handleCancelReply = () => {
    setParentId(null);
    setReplyingToUserName(null);
  };

  const handleLastReplyTopChange = (
    commentId: number,
    lastTopInViewport: number | null,
  ) => {
    const commentContainer = commentContainerRefs.current[commentId];

    if (!commentContainer || lastTopInViewport === null) {
      setReplyLineHeights((previous) => ({ ...previous, [commentId]: 0 }));
      return;
    }

    const commentTop = commentContainer.getBoundingClientRect().top;
    const nextHeight = Math.max(
      lastTopInViewport - commentTop - CONNECTOR_START_OFFSET,
      0,
    );

    setReplyLineHeights((previous) => ({
      ...previous,
      [commentId]: nextHeight,
    }));
  };

  return (
    <section className=" border-t border-borderColor comment-section py-4 md:py-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={data?.user?.profile_image_url || "/empty_user.jpg"}
            alt="Current user"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <CommentBoxArea
            postId={post?.id}
            parentId={parentId}
            replyingToUserName={replyingToUserName}
            onCancelReply={handleCancelReply}
          />
        </div>
      </div>

      <div className="mt-4 space-y-4 lg:space-y-6 ">
        {isCommentLoading ? (
          <div className="w-full space-y-3">
            {[...Array(3)].map((_, index) => (
              <div className="border-b " key={index}>
                <CommentRowSkeleton />
              </div>
            ))}
          </div>
        ) : (
          commentData?.data?.map((item) => (
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
              />
              {openReplyCommentId === item.id && (
                <div className="">
                  <CommentReplyList
                    commentId={item.id}
                    onLastReplyTopChange={(lastTopInViewport) =>
                      handleLastReplyTopChange(item.id, lastTopInViewport)
                    }
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        className="mt-6 text-[16px] font-semibold text-headerColor hover:opacity-80 cursor-pointer"
      >
        See all comments
      </button>
    </section>
  );
}

export default PostComment;
