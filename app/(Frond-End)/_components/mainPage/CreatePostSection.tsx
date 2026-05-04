"use client";
import RootDialog from "@/components/reusable/RootDialog";
import { setPostType } from "@/feature/slice/postCompose/postComposeSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import {
  EmojiIcon,
  ImageUploadIcon,
  PlayIcon,
  SendIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostAccessModal from "./post/PostAccessModal";
import PostGroupListModal from "./post/PostGroupListModal";
import PostModal from "./post/PostModal";

function CreatePostSection() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { data } = useGetUserProfileQuery("user");
  const { postType } = useSelector((state: any) => state.postCompose);
  const [postText, setPostText] = useState("");

  const handleSetPostType = (type: string) => {
    dispatch(setPostType(type as any));
  };

  return (
    <div className="rounded-md border border-borderColor bg-[#f6f7f8] p-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src={data?.user?.profile_image_url || "/empty_user.jpg"}
            alt="User avatar"
            width={32}
            height={32}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <textarea
          placeholder="Type your post..."
          rows={2}
          onClick={() => setIsOpen(true)}
          className="w-full resize-none bg-transparent text-sm text-headerColor placeholder:text-grayColor1 focus:outline-none"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
      </div>

      <div className="mt-3 border-t border-borderColor pt-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-descriptionColor">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="cursor-pointer transition-opacity hover:opacity-75"
              aria-label="Add image"
            >
              <ImageUploadIcon className="text-base" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="cursor-pointer transition-opacity hover:opacity-75"
              aria-label="Add video"
            >
              <PlayIcon className="text-base" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="cursor-pointer transition-opacity hover:opacity-75"
              aria-label="Add emoji"
            >
              <EmojiIcon className="text-base" />
            </button>
          </div>

          <button
            type="button"
            className="cursor-pointer text-descriptionColor transition-opacity hover:opacity-75"
            aria-label="Post"
          >
            <SendIcon className="text-base" />
          </button>
        </div>
      </div>
      {isOpen && (
        <RootDialog open={isOpen} setOpen={setIsOpen}>
          {postType == "Post_write" ? (
            <PostModal setOpen={setIsOpen} setPostType={handleSetPostType} />
          ) : postType == "post_access" ? (
            <PostAccessModal setPostType={handleSetPostType} />
          ) : (
            <PostGroupListModal setPostType={handleSetPostType} />
          )}
        </RootDialog>
      )}
    </div>
  );
}

export default CreatePostSection;
