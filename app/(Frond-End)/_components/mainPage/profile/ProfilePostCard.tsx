import { PostFeedType } from "@/lib/type";
import { formatPostDate } from "@/lib/utils";
import Image from "next/image";

import emptyImage from "@/public/empty_user.jpg";
import Link from "next/link";
import PostAction from "../post/PostAction";
import ProfileImagRender from "./ProfileImagRender";

type PostCardProps = {
  post?: PostFeedType;
  userId?: string | number;
};

function PostCard({ post, userId }: PostCardProps) {
  const { user, media, is_connected } = post || {};
  const mediaItems = media ?? [];

  return (
    <article className="rounded-xl  h-full flex flex-col justify-between border border-borderColor  p-2.5 md:p-3">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="h-10  w-10 rounded-full">
              <Image
                src={user?.profile_image_url || emptyImage}
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
          <ProfileImagRender mediaItems={mediaItems} />
        </div>

        <div className="flex justify-between py-1 text-sm font-semibold text-headerColor">
          <p>{`${post?.total_like} likes`}</p>
          <p>{`${post?.total_comment} comments`}</p>
        </div>
      </div>

      <div className="mt-2  border-t text-center text-primaryColor underline text-base font-semibold border-borderColor pt-2">
        <Link href={`/mu/profile/${userId}/posts`}>View Details</Link>
      </div>
    </article>
  );
}

export default PostCard;
