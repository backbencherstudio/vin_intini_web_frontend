"use client";

import ProfileEducationSkeleton from "@/components/reusable/All Skleton/ProfileEducationSkeleton";
import { profileEducations } from "@/public/demoData/DemoData";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ProfileEducationCard from "./ProfileEducationCard";
import ProfileEducationForm, {
  type EducationFormValues,
} from "./ProfileEducationForm";

type ProfileEducationItem = (typeof profileEducations)[number];




function ProfileEducationList() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [educationItems, setEducationItems] = useState<ProfileEducationItem[]>(
    profileEducations as ProfileEducationItem[],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const openCreateForm = () => {
    setIsFormOpen(true);
  };



  return (
    <section className="border-b border-borderColor pb-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Education
        </h2>
        <button
          type="button"
          aria-label="Add education"
          onClick={openCreateForm}
          className="cursor-pointer text-headerColor hover:text-primaryColor"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div>
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <ProfileEducationSkeleton key={`education-skeleton-${index}`} />
            ))
          : educationItems.map((item, index) => (
              <ProfileEducationCard
                key={item.id}
                item={item}
                borderb={index !== educationItems.length - 1}
              />
            ))}
      </div>

      {isFormOpen && (
        <ProfileEducationForm
          open={isFormOpen}
          setOpen={setIsFormOpen}
        />
      )}
    </section>
  );
}

export default ProfileEducationList;
