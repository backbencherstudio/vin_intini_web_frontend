"use client";
import { EditeIcon } from "@/public/svgIcons/Icons";
import { useState } from "react";

function ProfileAbout() {
  const [isNotify, setIsNotify] = useState(false);
  return (
    <div className="pb-4 border-b border-borderColor">
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4">About</h2>

        <button
          aria-label="notify-open"
          onClick={() => setIsNotify(true)}
          className="cursor-pointer"
        >
          <EditeIcon />
        </button>
      </div>
      <p className="text-base text-descriptionColor leading-[150%]">
        I’m a UI/UX designer focused on creating intuitive, visually engaging,
        and user-centered digital experiences for websites and mobile
        applications. I specialize in transforming complex ideas into simple,
        functional, and aesthetically pleasing interfaces. Currently working as
        a freelance UI/UX designer, I collaborate with clients to design modern
        landing pages, SaaS dashboards, and mobile app interfaces that improve
        usability and engagement.
      </p>
    </div>
  );
}

export default ProfileAbout;
