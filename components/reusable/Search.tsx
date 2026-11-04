"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";

export default function Search({
  placeHolder,
  className,
}: {
  placeHolder?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    () => searchParams.get("search") || "",
  );

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();

      if (nextQuery === currentQuery) return;

      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}`, {
        scroll: false,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search, pathname, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        name="search"
        value={search}
        onChange={handleChange}
        className={cn(
          "w-full h-10 text-sm bg-white border border-borderColor rounded-lg px-4 pl-9 text-headerColor placeholder:text-placeholderColor focus:outline-none focus:border-primaryColor transition-all",
          className,
        )}
        placeholder={placeHolder || "Search..."}
      />
      <div className="absolute left-3 text-grayColor1 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
        <LuSearch className="w-4 h-4" />
      </div>
    </div>
  );
}
