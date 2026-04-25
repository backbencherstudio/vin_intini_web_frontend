"use client";
import RootDialog from "@/components/reusable/RootDialog";
import logoPreview from "@/public/images/company-logo-1.png";
import coverPreview from "@/public/images/cover imager.png";
import {
  GroupUserIcon,
  LogoutIcon,
  NotificationIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useState } from "react";
import GroupLeaveDialog from "./GroupLeaveDialog";
import GroupNotifySetting from "./GroupNotifySetting";

function GroupHeroSection() {
  const [isleaved, setILeaved] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  return (
    <section>
      <div className=" h-40 md:h-48 w-full bg-gradient-to-r rounded-md from-cyan-100 to-blue-200">
        <Image
          src={coverPreview}
          className="w-full h-full object-cover rounded-md"
          alt="Cover"
          width={1200}
          height={400}
        />

        {/* Floating Logo Box */}
        <div className="flex px-4 justify-between w-full">
          <div className="-mt-11  h-20 w-20 bg-bgLightColor rounded-md flex items-center justify-center">
            <Image
              src={logoPreview}
              className="w-full h-full object-cover rounded-md"
              alt="Logo"
              width={80}
              height={80}
            />
          </div>
          <div className="flex gap-6 ">
            <button
              aria-label="notify-open"
              onClick={() => setIsNotify(true)}
              className="cursor-pointer"
            >
              <NotificationIcon />
            </button>
            <button
              aria-label="leave-open"
              onClick={() => setILeaved(true)}
              className="cursor-pointer"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 border-b border-borderColor pb-4">
        <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
          Group Name (If the group name is too long then the sentence should
          wrap into next line like this one)
        </h4>

        <div className="flex items-center gap-2.5 mt-2 text-grayColor1">
          <GroupUserIcon />
          <p className="text-sm   line-clamp-3">217,578 members</p>
        </div>
      </div>
      <RootDialog
        open={isleaved || isNotify}
        setOpen={isleaved ? setILeaved : setIsNotify}
        className=" max-w-[600px]!"
      >
        {isleaved ? (
          <GroupLeaveDialog setIsNotify={setILeaved} />
        ) : (
          <GroupNotifySetting setIsNotify={setIsNotify} />
        )}
      </RootDialog>
    </section>
  );
}

export default GroupHeroSection;
