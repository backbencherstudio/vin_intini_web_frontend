"use client";
import coverPreview from "@/public/images/cover imager.png";
import logoPreview from "@/public/profile.png";
import { EditeIcon, GroupUserIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import { useState } from "react";
import { MdWorkOutline } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import ProfileUpdateForm from "./ProfileUpdateForm";

function ProfileHeroSection() {
  const [isNotify, setIsNotify] = useState(false);
  return (
    <section>
      <div className=" h-40 md:h-48 w-full bg-linear-to-r rounded-md from-cyan-100 to-blue-200">
        <Image
          src={coverPreview}
          className="w-full h-full object-cover rounded-md"
          alt="Cover"
          width={1200}
          height={400}
        />

        {/* Floating Logo Box */}
        <div className="flex px-4 justify-between w-full">
          <div className="-mt-11  h-20 w-20 bg-bgLightColor rounded-full flex items-center justify-center">
            <Image
              src={logoPreview}
              className="w-full h-full object-cover "
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
              <EditeIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-12 border-b border-borderColor pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="col-span-2">
            <h4 className="text-lg font-semibold text-headerColor leading-[150%]">
              vin Intini
            </h4>
            <p className="text-grayColor1 text-sm">
              Software Engineer | Tech Enthusiast
            </p>
            <p className="text-grayColor1 text-sm">Dhaka, Bangladesh</p>
            <div className="flex items-center gap-2.5 mt-2 text-grayColor1">
              <GroupUserIcon />
              <p className="text-sm   line-clamp-3">217,578 Connection</p>
            </div>
          </div>
          <div className="space-y-3 col-span-1">
            <div className="flex items-center text-descriptionColor font-semibold gap-2">
              <MdWorkOutline size={22} />
              <p>Betopia Group</p>
            </div>
            <div className="flex items-center text-descriptionColor font-semibold gap-1.5">
              <PiStudent size={24} className="" />
              <p>Dhaka University</p>
            </div>
          </div>
        </div>
      </div>

      {isNotify && <ProfileUpdateForm open={isNotify} setOpen={setIsNotify} />}
    </section>
  );
}

export default ProfileHeroSection;
