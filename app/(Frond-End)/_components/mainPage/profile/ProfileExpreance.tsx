"use client";
import { profileExperiences } from "@/public/demoData/DemoData";
import { Plus } from "lucide-react";
import { useState } from "react";
import ExpreanceAddFrom from "./ExpreanceAddFrom";
import ProfileExpreanceCard from "./ProfileExpreanceCard";

function ProfileExpreance() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <section className="border-b border-borderColor pb-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Experience
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Add experience"
            onClick={() => setIsAddOpen(true)}
            className="cursor-pointer text-headerColor hover:text-primaryColor"
          >
            <Plus className="h-5 w-5" />
          </button>
          {/* <button
            type="button"
            aria-label="Edit experience"
            className="cursor-pointer text-headerColor hover:text-primaryColor"
          >
            <EditeIcon className="h-4 w-4" />
          </button> */}
        </div>
      </div>

      <div>
        {profileExperiences.map((item, index) => (
          <ProfileExpreanceCard
            key={index}
            item={item}
            borderb={index !== profileExperiences.length - 1}
          />
        ))}
      </div>

      {isAddOpen && (
        <ExpreanceAddFrom open={isAddOpen} setOpen={setIsAddOpen} />
      )}
    </section>
  );
}

export default ProfileExpreance;
