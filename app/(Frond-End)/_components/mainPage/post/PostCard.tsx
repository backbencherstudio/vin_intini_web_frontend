import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "@/lib/dayjs";
import { PostFeedType } from "@/lib/type";
import {
  CommentIcon,
  DeleteIcon,
  DotIcon,
  LikeIcon,
  UserBanIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useState } from "react";
import DeleteGroup from "../group/DeleteGroup";
import GroupUserBanDialog from "../group/GroupUserBanDialog";
import PostComment from "./PostComment";
import PostImageShowDialog from "./PostImageShowDialog";
import PostImageRender from "./PostImageRender";

type PostCardProps = {
  post?: PostFeedType;
};



function PostCard({ post }: PostCardProps) {
  const { user, media, is_connected } = post || {};
  const mediaItems = media ?? [];
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isBanUser, setIsBanUser] = useState(false);
  const [isCommented, setIsCommented] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  let likesCount = 10;
  if (isLiked) {
    likesCount += 1;
  }

  const formatPostDate = (date: string) => {
    const postDate = dayjs(date);
    const now = dayjs();
    const diffDays = now.diff(postDate, "day");

    if (diffDays >= 7) {
      return postDate.format("YYYY-MM-DD HH:mm:ss");
    }

    return postDate.fromNow();
  };

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
  };



 

  return (
    <article className="rounded-xl border border-borderColor p-2.5 md:p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="h-10 w-10 rounded-full">
            <Image
              src="/empty_user.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
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

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={`h-7 rounded-full border px-3 text-sm font-medium transition-all duration-200 hover:tracking-widest cursor-pointer ${
              is_connected
                ? "border-buttonColor bg-buttonColor text-whiteColor"
                : "border-headerColor/60 bg-transparent text-headerColor/80"
            }`}
          >
            {is_connected ? "Connected" : "Connect"}
          </button>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="cursor-pointer focus:outline-0">
              <DotIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-3">
              <h4 className="text-base font-semibold leading-[140%] text-headerColor md:text-lg">
                Action
              </h4>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  setIsDeleted(true);
                }}
                className="cursor-pointer"
              >
                <DeleteIcon /> Delete post
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  setIsBanUser(true);
                }}
                className="cursor-pointer"
              >
                <UserBanIcon /> Ban User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
        <p>10 comments</p>
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

      <div className="mt-2">{isCommented && <PostComment />}</div>

      {isBanUser && (
        <GroupUserBanDialog open={isBanUser} setOpen={setIsBanUser} />
      )}
      {isDeleted && <DeleteGroup open={isDeleted} setOpen={setIsDeleted} />}

    
    </article>
  );
}

export default PostCard;
