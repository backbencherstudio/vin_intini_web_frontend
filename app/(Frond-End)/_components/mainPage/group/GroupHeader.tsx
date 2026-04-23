"use client";
import RootDialog from "@/components/reusable/RootDialog";
import Search from "@/components/reusable/Search";
import { useState } from "react";
import GroupCreateModal from "./GroupCreateModal";

function GroupHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-2">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Groups{" "}
        </h2>
        <div className="flex  items-center gap-3">
          <div className="relative w-[300px] hidden md:block  max-w-full">
            <Search placeHolder="Search Group" />
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Create Group"
            className="rounded-full border border-primaryColor px-4 py-1.5 font-semibold text-base leading-[140%]  text-primaryColor cursor-pointer hover:bg-primaryColor hover:text-whiteColor hover:shadow-md shadow-primaryColor/50 tracking-wide transition-all duration-200"
          >
            Create Group
          </button>
        </div>

        <div className="relative w-[300px] mx-auto md:hidden  max-w-full">
          <Search />
        </div>
      </div>
      {isOpen && (
        <RootDialog open={isOpen} setOpen={setIsOpen}>
          <GroupCreateModal />
        </RootDialog>
      )}
    </div>
  );
}

export default GroupHeader;
