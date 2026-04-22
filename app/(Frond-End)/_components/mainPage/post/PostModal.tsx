"use client";

import { Button } from "@/components/ui/button";
import {
  EmojiIcon,
  ImageUploadIcon,
  MenueArrowDownIcon,
  PlayIcon,
  SendIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useState } from "react";

function PostModal({ setPostType }: { setPostType: (type: string) => void }) {
  const [postText, setPostText] = useState("");

  return (
    <section className="relative bg-whiteColor px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/profile.png"
              alt="Vin Intiny"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-[20px] font-semibold leading-6 text-descriptionColor">
              Vin Intiny
            </h3>

            <button
              type="button"
              onClick={() => setPostType("post_access")}
              className="mt-0.5 inline-flex items-center leading-[160%] gap-1 text-[14px] text-descriptionColor hover:opacity-80"
            >
              <span>Post for everyone</span>
              <MenueArrowDownIcon className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <textarea
        value={postText}
        onChange={(event) => setPostText(event.target.value)}
        placeholder="What’s in you mind today?"
        rows={11}
        className="min-h-[300px] w-full resize-none bg-transparent text-[17px] leading-7 text-headerColor placeholder:text-grayColor1 focus:outline-none"
      />
      <div>
        <button
          type="button"
          className="flex items-center cursor-pointer gap-1.5 text-descriptionColor transition hover:opacity-80"
          aria-label="Add emoji"
        >
          <EmojiIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-borderColor pt-3">
        <div className="flex justify-between items-center w-full gap-5">
          <div className="flex">
            <button
              type="button"
              className="flex h-8 w-8 items-center cursor-pointer justify-center text-descriptionColor transition hover:opacity-80"
              aria-label="Add image"
            >
              <ImageUploadIcon className="h-4.5 w-4.5" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-descriptionColor transition hover:opacity-80"
              aria-label="Add video"
            >
              <PlayIcon className="h-5 w-5" />
            </button>
          </div>

          <Button
            type="button"
            className=" h-8 rounded-full cursor-pointer leading-[160%] bg-buttonColor px-5 text-[14px] font-semibold text-whiteColor  hover:bg-buttonColor/90 hover:shadow-xl"
          >
            <SendIcon className="mr-1 h-2.5 w-3.5" />
            Post
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PostModal;
