"use client";
import { useGetProfileByIdQuery } from "@/feature/slice/user/userSlice";
import { EditeIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";
import ProfileAboutUpdateForm from "./ProfileAboutUpdateForm";

function ProfileAbout({ userId }: { userId: string }) {
  const [isNotify, setIsNotify] = useState(false);
  const { data, isLoading, isError } = useGetProfileByIdQuery(userId);

  return (
    <div className="pb-4 border-b border-borderColor">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold ">About</h2>

        <button
          aria-label="notify-open"
          onClick={() => setIsNotify(true)}
          className="cursor-pointer"
        >
          <EditeIcon />
        </button>
      </div>
      <p className="text-base text-descriptionColor leading-[150%]">
        {data?.data?.about || "No about information available."}
      </p>

      {isNotify && (
        <ProfileAboutUpdateForm
          open={isNotify}
          setOpen={setIsNotify}
          initialAbout={data?.data?.about || "No about information available."}
        />
      )}
    </div>
  );
}

export default ProfileAbout;
