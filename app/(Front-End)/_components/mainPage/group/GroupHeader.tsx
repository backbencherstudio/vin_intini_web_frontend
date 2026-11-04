"use client";
import Search from "@/components/reusable/Search";
import { useState } from "react";
import CreateGroupForm from "./GroupCreateModal";

function GroupHeader() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-3 min-h-[66px]">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Groups
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative w-64 lg:w-72 hidden md:block max-w-full">
            <Search placeHolder="Search Group" />
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Create Group"
            className="h-10 inline-flex items-center justify-center shrink-0 rounded-full border border-primaryColor px-5 font-semibold text-sm leading-none text-primaryColor cursor-pointer hover:bg-primaryColor hover:text-whiteColor hover:shadow-md shadow-primaryColor/50 tracking-wide transition-all duration-200"
          >
            Create Group
          </button>
        </div>

        <div className="relative w-full md:hidden max-w-full">
          <Search placeHolder="Search Group" />
        </div>
      </div>
      {isOpen && <CreateGroupForm open={isOpen} setOpen={setIsOpen} />}
    </div>
  );
}

export default GroupHeader;
