import { DoubleArrowIcon, LeftArrowIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import MessageUserSection from "./_component/MessageUserSection";

function layout({ children }: { children: React.ReactNode }) {
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
      <div className="h-full bg-white flex ">
        {/* Sidebar */}
        <div className="lg:max-w-90 max-w-80 hidden md:border-r pr-4 w-full  md:flex flex-col">
          <MessageUserSection />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

export default layout;
