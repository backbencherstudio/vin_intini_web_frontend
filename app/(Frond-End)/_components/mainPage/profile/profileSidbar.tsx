"use client";
import ProfileUserSkleton from "@/components/reusable/All Skleton/ProfileUserSkleton";
import { suggestedProfiles } from "@/public/demoData/DemoData";
import { useEffect, useState } from "react";
import ProfileUserConnectCard from "./ProfileUserConnectCard";

function ProfileSidebar() {
  const peopleYouMayKnow = suggestedProfiles.slice(0, 6);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="w-full  bg-white  py-3">
      <div className="border-b border-borderColor pb-3">
        <h3 className="text-base md:text-lg font-semibold leading-[120%] text-headerColor">
          People you may know
        </h3>
      </div>

      <div>
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <ProfileUserSkleton key={i} />)
          : peopleYouMayKnow.map((profile, index) => (
              <ProfileUserConnectCard
                key={profile.id}
                profile={profile}
               
              />
            ))}
      </div>
    </aside>
  );
}

export default ProfileSidebar;
