"use client";

import ProfileEducationSkeleton from "@/components/reusable/All Skleton/ProfileEducationSkeleton";
import { useGetStudyQuery } from "@/feature/slice/user/studySlice";
import { EducationType } from "@/lib/type";
import { Plus } from "lucide-react";
import { useState } from "react";
import ProfileEducationCard from "./ProfileEducationCard";
import ProfileEducationForm from "./ProfileEducationForm";

function ProfileEducationList({ userId }: { userId?: string }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data, isLoading } = useGetStudyQuery(userId);
  const educationItems: EducationType[] = data?.data || [];

  const openCreateForm = () => {
    setIsFormOpen(true);
  };

  return (
    <section className=" pb-4">
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
              <ProfileEducationCard key={item.id} item={item} />
            ))}
      </div>

      {isFormOpen && (
        <ProfileEducationForm open={isFormOpen} setOpen={setIsFormOpen} />
      )}
    </section>
  );
}

export default ProfileEducationList;
