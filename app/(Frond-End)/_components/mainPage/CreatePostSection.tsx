"use client";
import RootDialog from "@/components/reusable/RootDialog";
import {
  EmojiIcon,
  ImageUploadIcon,
  PlayIcon,
  SendIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import PostAccessModal from "./post/PostAccessModal";
import PostGroupListModal from "./post/PostGroupListModal";
import PostModal from "./post/PostModal";

function CreatePostSection() {
  const [isOpen, setIsOpen] = useState(false);
  const data = useSelector((state: any) => state.postCompose);
  console.log(data);

  const [postType, setPostType] = useState("Post_write");
  const [postText, setPostText] = useState("");
  return (
    <div className="rounded-md border border-borderColor bg-[#f6f7f8] p-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
          <Image
            src="/profile.png"
            alt="User avatar"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>

        <textarea
          placeholder="Type your post..."
          rows={2}
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
            <PostModal setPostType={setPostType} />
          ) : postType == "post_access" ? (
            <PostAccessModal setPostType={setPostType} />
          ) : (
            <PostGroupListModal setPostType={setPostType} />
          )}
        </RootDialog>
      )}
    </div>
  );
}

export default CreatePostSection;
