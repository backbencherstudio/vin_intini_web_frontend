import groupImage from "@/public/images/company-logo-1.png";
import { GroupUserIcon } from "@/public/svgIcons/Icons";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function GroupCard({ group }: { group: any }) {
  return (
    <div>
      <div className="border-b border-borderColor py-4 first:pt-5">
        <div className="flex items-start gap-3">
          <div className="flex xl:h-18 xl:w-18 w-12 h-12 lg:w-14 lg:h-14 shrink-0 items-center justify-center rounded-md bg-bgColor text-[#70757f]">
            {group.isFirst ? (
              <ImageIcon size={30} strokeWidth={1.8} />
            ) : (
              <Image
                src={groupImage}
                alt="Group placeholder"
                width={72}
                height={72}
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>

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
            href={`/mu/my-network/group/${group.id}`}
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
