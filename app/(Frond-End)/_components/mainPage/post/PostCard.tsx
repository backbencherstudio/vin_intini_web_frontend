import { CommentIcon, LikeIcon } from "@/public/svgIcons/Icons";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import PostComment from "./PostComment";

export type PostCardData = {
  id: number;
  authorName: string;
  authorTitle: string;
  timeAgo: string;
  contentLines: string;
  previewTitle?: string;
  isConnected?: boolean;
  image: string | StaticImageData;
};

type PostCardProps = {
  post?: PostCardData;
};

function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommented, setIsCommented] = useState(false);
  let likesCount = 10; // This should ideally come from post data
  if (isLiked) {
    likesCount += 1;
  } else {
    likesCount;
  }

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
  };
  return (
    <article className="rounded-xl border border-borderColor  p-2.5 md:p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full">
            <Image
              src={"/profile.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="">
            <h4 className=" text-base line-clamp-1 leading-7 font-semibold text-headerColor">
              {post.authorName}
            </h4>
            <p className=" text-sm line-clamp-1 leading-5 text-descriptionColor">
              {post.authorTitle}
            </p>
            <p className="text-[14px] leading-5 text-grayColor1">
              {post.timeAgo}
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`h-7 rounded-full border px-3 hover:tracking-widest transition-all duration-200 text-sm font-medium cursor-pointer ${
            post.isConnected
              ? "border-buttonColor bg-buttonColor text-whiteColor"
              : "border-headerColor/60 bg-transparent text-headerColor/80"
          }`}
        >
          {post.isConnected ? "Connected" : "Connect"}
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-[16px] leading-7 text-headerColor/85 break-words">
          {post.contentLines}
        </p>
      </div>

      <div className="mt-4 overflow-hidden border  border-borderColor bg-[#eff1f4]">
        <Image
          src={post.image}
          alt="Post image"
          width={800}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex text-sm font-semibold text-headerColor py-1 justify-between">
        <p>{`${likesCount} likes`}</p>
        <p>{"10 comments"}</p>
      </div>
      <div className="mt-2 grid grid-cols-2 border-t border-borderColor pt-2">
        <button
          type="button"
          onClick={handleLikeClick}
          className={`${isLiked ? " text-primaryColor" : ""} flex items-center font-semibold justify-center gap-2 py-1.5 text-headerColor/90 text-[16px] cursor-pointer hover:opacity-80`}
        >
          <LikeIcon
            className={` ${isLiked ? " stroke-primaryColor" : ""} w-4.5 h-4.5 `}
          />
          <span>Like</span>
        </button>
        <button
          type="button"
          onClick={() => setIsCommented((prv) => !prv)}
          className="flex items-center font-semibold justify-center   gap-2 py-1.5 text-headerColor/90 text-[16px] cursor-pointer hover:opacity-80"
        >
          <CommentIcon className="w-4.5 h-4.5" />
          <span>Comments</span>
        </button>
      </div>
      <div className="mt-2">{isCommented && <PostComment />}</div>
    </article>
  );
}

export default PostCard;
