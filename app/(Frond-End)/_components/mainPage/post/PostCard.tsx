
import { PostFeedType } from "@/lib/type";
import { formatPostDate } from "@/lib/utils";
import { CommentIcon, LikeIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useState } from "react";
import PostAction from "./PostAction";
import PostComment from "./PostComment";
import PostImageRender from "./PostImageRender";
import { usePostToggleLikeMutation } from "@/feature/slice/post/likeslice";

type PostCardProps = {
  post?: PostFeedType;
};

function PostCard({ post }: PostCardProps) {
  const { user, media, is_connected } = post || {};
  const mediaItems = media ?? [];
  const [isLiked, setIsLiked] = useState(Boolean(post?.liked_by_me));
  const [isCommented, setIsCommented] = useState(false);

  const [postToggleLike] = usePostToggleLikeMutation();
  const likedByMe = Boolean(post?.liked_by_me);
  const likesCount = Math.max(
    0,
    (post?.total_like || 0) + (isLiked === likedByMe ? 0 : isLiked ? 1 : -1),
  );

  const handleLikeClick = async () => {
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);

    try {
      await postToggleLike({
        postId: post?.id ?? "",
      }).unwrap();
    } catch (error) {
      setIsLiked(!newLikedStatus);
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <article className="rounded-xl border border-borderColor p-2.5 md:p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="h-10  w-10 rounded-full">
            <Image
              src={user?.profile_image_url || "/empty_user.jpg"}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="line-clamp-1 text-base font-semibold leading-7 text-headerColor">
              {user?.first_name + " " + user?.last_name || "Vin Intini"}
            </h4>
            <p className="line-clamp-1 text-sm leading-5 text-descriptionColor">
              {user?.title || "CEO & Founder, MindUnite"}
            </p>
            <p className="text-[14px] leading-5 text-grayColor1">
              {formatPostDate(post?.created_at || new Date().toISOString())}
            </p>
          </div>
        </div>

        <PostAction post={post} />
      </div>

      <div className="mt-4 space-y-1">
        <p className="wrap-break-word text-[16px] leading-7 text-headerColor/85">
          {post?.description}
        </p>
      </div>
      <div>
        <PostImageRender mediaItems={mediaItems} />
      </div>

      <div className="flex justify-between py-1 text-sm font-semibold text-headerColor">
        <p>{`${likesCount} likes`}</p>
        <p>{`${post?.total_comment} comments`}</p>
      </div>

      <div className="mt-2 grid grid-cols-2 border-t border-borderColor pt-2">
        <button
          type="button"
          onClick={handleLikeClick}
          className={`${isLiked ? " text-primaryColor" : ""} flex items-center justify-center gap-2 py-1.5 text-[16px] font-semibold text-headerColor/90 cursor-pointer hover:opacity-80`}
        >
          <LikeIcon
            className={` ${isLiked ? " stroke-primaryColor" : ""} h-4.5 w-4.5`}
          />
          <span>Like</span>
        </button>
        <button
          type="button"
          onClick={() => setIsCommented((previous) => !previous)}
          className="flex items-center justify-center gap-2 py-1.5 text-[16px] font-semibold text-headerColor/90 cursor-pointer hover:opacity-80"
        >
          <CommentIcon className="h-4.5 w-4.5" />
          <span>Comments</span>
        </button>
      </div>

      <div className="mt-2">{isCommented && <PostComment post={post} />}</div>
    </article>
  );
}

export default PostCard;
