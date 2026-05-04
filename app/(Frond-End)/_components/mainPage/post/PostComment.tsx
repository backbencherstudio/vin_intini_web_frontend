import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  useGetAllCommentListByPostIdQuery,
  useGetReplyListByCommentIdQuery,
} from "@/feature/slice/post/commentSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { PostFeedType } from "@/lib/type";
import Image from "next/image";
import { useState } from "react";

import CommentRowSkeleton from "@/components/reusable/All Skleton/PostCommentSkleton";
import { useReplyLikeListQuery } from "@/feature/slice/post/likeSlice";
import CommentBoxArea from "./CommentBoxArea";
import CommentRow from "./CommentCard";

type CommentItem = {
  id: number;
  depth?: number;
  message?: string;
  showReply?: boolean;
  replyComments?: CommentItem[];
};

const mainComment: CommentItem[] = [
  {
    id: 1,
    showReply: true,
    message: "This is a sample comment.",
    replyComments: [
      { id: 2, message: "This is a sample comment reply one." },
      { id: 3, message: "This is a sample comment reply two." },
      { id: 4, message: "This is a sample comment reply three." },
    ],
  },
  {
    id: 2,
    showReply: true,
    message: "This is a sample comment.",
    replyComments: [
      { id: 2, message: "This is a sample comment reply one." },
      { id: 3, message: "This is a sample comment reply two." },
      { id: 4, message: "This is a sample comment reply three." },
    ],
  },
];

function PostComment({ post }: { post?: PostFeedType }) {
  const { data } = useGetUserProfileQuery("user");
  const { data: commentData, isLoading: isCommentLoading } =
    useGetAllCommentListByPostIdQuery(post?.id);
  const { data: replyData } = useGetReplyListByCommentIdQuery(post?.id);
  const { data: replyLikeData } = useReplyLikeListQuery(post?.id);
  console.log(commentData, "comment data check");

  const [parentId, setParentId] = useState<number | null>(null);

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
          <CommentBoxArea postId={post?.id} parentId={parentId} />
        </div>
      </div>

      <div className="mt-4 space-y-4 ">
        <Accordion type="single" collapsible defaultValue="replies">
          {isCommentLoading ? (
            <div className="w-full space-y-3">
              {[...Array(3)].map((_, index) => (
                <div className="border-b ">

                  <CommentRowSkeleton  />
                </div>
              ))}
            </div>
          ) : (
            commentData?.data?.map((item) => (
              <AccordionItem
                value="replies"
                className="border-b-0 relative after:content-[''] after:absolute after:top-11 after:bottom-23 after:left-3.5 after:w-px after:bg-borderColor"
                key={item?.id}
              >
                <AccordionTrigger className="py-3 pb-6  text-[15px] cursor-pointer font-semibold text-headerColor hover:no-underline">
                  <CommentRow item={item} depth={0} />
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {/* <div className="space-y-5 relative">
                  {item?.replyComments.map((reply) => (
                    <CommentRow key={reply.id} item={reply} depth={1} />
                  ))}
                </div> */}
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
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
