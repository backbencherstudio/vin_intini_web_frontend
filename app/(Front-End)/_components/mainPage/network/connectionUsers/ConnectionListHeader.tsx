"use client";
import SelecteInputField from "@/components/reusable/InputFiled/SelecteInputField";
import Search from "@/components/reusable/Search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function ConnectionListHeader({ data }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedSort, setSelectedSort] = useState("");

  const sortOptions = [
    { value: "recent", label: "Recent" },
    { value: "az", label: "Name (A-Z)" },
    { value: "za", label: "Name (Z-A)" },
  ];

  useEffect(() => {
    const sortParam = searchParams.get("sort") || "";
    if (sortParam) {
      setSelectedSort(sortParam);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (selectedSort) {
      params.set("sort", selectedSort);
    } else {
      params.delete("sort");
    }
    const nextQuery = params.toString();
    const currentQuery = window.location.search.replace(/^\?/, "");
    if (nextQuery === currentQuery) return;
    router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}`, {
      scroll: false,
    });
  }, [selectedSort, pathname, router]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-3 min-h-[66px]">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Total Connections{" "}
          <span className="text-base font-normal text-grayColor1">
            ({data?.total || 0})
          </span>
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative w-64 lg:w-72 hidden md:block max-w-full">
            <Search placeHolder="Search connection..." />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-grayColor1 hidden lg:block text-nowrap text-sm">
              Sort by:
            </span>
            <SelecteInputField
              value={selectedSort}
              onValueChange={setSelectedSort}
              options={sortOptions}
              placeholder="Sort by"
              className="h-10! border-none! px-1! shadow-none! font-semibold shadow-transparent! text-[14px]"
            />
          </div>
        </div>

        <div className="relative w-full md:hidden max-w-full">
          <Search placeHolder="Search connection..." />
        </div>
      </div>
    </div>
  );
}

export default ConnectionListHeader;
