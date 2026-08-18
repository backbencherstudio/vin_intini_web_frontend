"use client";
import { DoubleArrowIcon, LeftArrowIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsEmojiFrown } from "react-icons/bs";

function page() {
  const router = useRouter();
  return (
    <div>
      <div >

        <div className="flex flex-col justify-center p-4 w-full md:p-6 items-center">
          <div className="h-135 flex flex-col px-4 max-w-134.75 w-full items-center justify-center gap-2">
            <BsEmojiFrown size={24} />
            <p className="text-center text-headerColor font-semibold">
              You don’t have any messages at the moment.
            </p>
            <p className="text-center text-sm text-grayColor1">
              No messages found at the moment. Start a conversation to engage
              with others, ask questions, or share your thoughts. Don’t wait—get
              the conversation going now and stay connected!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
