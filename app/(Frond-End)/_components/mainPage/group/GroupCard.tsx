import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { FigmaMark } from "../GroupSidbar";

function GroupCard({ group }: { group: any }) {
  return (
    <div>
      <div className="border-b border-borderColor py-4 first:pt-5">
        <div className="flex items-start gap-3">
          {group.isFirst ? (
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-md bg-bgColor text-[#70757f]">
              <ImageIcon size={30} strokeWidth={1.8} />
            </div>
          ) : (
            <FigmaMark />
          )}

          <div className="min-w-0 flex-1">
            <p className="text-base md:text-lg leading-[150%]  font-semibold text-headerColor">
              {group.name}
            </p>

            <div className="mt-1.5 flex items-center gap-2 text-grayColor1">
              <GroupUserIcon />
              <span className="text-[13px] leading-5">
                {group.membersLabel}
              </span>
            </div>
          </div>
          <Link
            href={`/mu/2/my-network/group/${group.id}`}
            className={`py-0.5! px-4! border rounded-full!   border-headerColor!  text-headerColor! bg-whiteColor! hover:border-primaryColor! hover:text-primaryColor! hover:bg-primaryColor/10! mt-4!`}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GroupCard;
