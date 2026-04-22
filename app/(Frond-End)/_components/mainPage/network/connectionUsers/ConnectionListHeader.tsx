"use client";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import Search from "@/components/reusable/Search";
import { useState } from "react";

function ConnectionListHeader() {
  const [selectedSort, setSelectedSort] = useState("Recently Added");

  const sortOptions = [
    { iso_code: "recent", country: "Recently Added" },
    { iso_code: "oldest", country: "Oldest" },
    { iso_code: "name_asc", country: "Name (A-Z)" },
    { iso_code: "name_desc", country: "Name (Z-A)" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row w-full justify-between items-center">
        <h1 className="text-base text-nowrap lg:text-xl md:block hidden font-semibold text-headerColor">
          Total Connection{" "}
          <span className="font-normal text-grayColor1">(1500)</span>
        </h1>
        <div className="flex gap-4 justify-between w-full items-center">
          <h1 className="text-base md:hidden font-semibold text-headerColor">
            Total Connection{" "}
            <span className="font-normal text-grayColor1">(1500)</span>
          </h1>
          <div className="relative w-[220px] lg:w-[300px] mx-auto hidden md:block  max-w-full">
            <Search />
          </div>
          <div className="flex items-center ">
            <span className="text-grayColor1 hidden lg:block text-nowrap">
              Sort by:
            </span>
            <SelecteInputField
              value={selectedSort}
              onValueChange={setSelectedSort}
              options={sortOptions}
              placeholder="Sort by"
              className="h-10 border-none! px-1! shadow-none! shadow-transparent! text-[14px]"
            />
          </div>
        </div>
        <div className="relative w-[400px] mx-auto md:hidden  max-w-full">
          <Search />
        </div>
      </div>
    </div>
  );
}

export default ConnectionListHeader;
