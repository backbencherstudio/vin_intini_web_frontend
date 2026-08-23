"use client";
import { DoubleArrowIcon, LeftArrowIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import MessageUserSection from "./_component/MessageUserSection";

function layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  return (
    <div className="py-6 md:py-8">
      <div className="flex gap-6 items-center mb-4 md:mb-6">
        <Link
          href={"/mu/message"}
          className="flex cursor-pointer gap-1.5 font-semibold text-headerColor items-center"
        >
          <LeftArrowIcon />
          Back
        </Link>
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
      <div className="h-full bg-white p-4 rounded-xl flex">
        {/* Sidebar */}
        <div
          className={`md:max-w-80 lg:max-w-90 md:border-r ${params?.id ? "hidden" : "block"} md:pr-4 w-full md:flex flex-col`}
        >
          <MessageUserSection />
        </div>
        <div className={`w-full ${params?.id ? "block" : "hidden"} md:block`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default layout;
