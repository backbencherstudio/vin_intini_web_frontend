"use client";
import { DoubleArrowIcon, LeftArrowIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MessageRoot from "./_component/MessageRoot";

function page() {
  const router = useRouter();
  return (
    <div>
      <div className="py-6 md:py-8">
        <div className="flex gap-6 items-center mb-4 md:mb-6">
          <button
            className="flex cursor-pointer gap-1.5 font-semibold text-headerColor items-center"
            onClick={() => router.back()}
          >
            <LeftArrowIcon />
            Back
          </button>
          <div className="flex gap-2  items-center">
            <Link href={"/mu/home"} className="">
              Home
            </Link>
            <DoubleArrowIcon />
            <Link href={"/mu/message"} className="">
              Messages
            </Link>
          </div>
        </div>
        <MessageRoot />
      </div>
    </div>
  );
}

export default page;
