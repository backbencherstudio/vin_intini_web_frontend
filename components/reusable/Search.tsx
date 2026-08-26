"use client";

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
        className={`w-full text-sm bg-whiteColor border border-gray2Color rounded-full py-2 px-4 pl-8 focus:outline-none focus:border-dark-500 ${className}`}
        placeholder={placeHolder || "Search Network"}
      />
      <div className="absolute left-2 text-grayColor1 top-1/2 -translate-y-1/2 text-2xl">
        <LuSearch className="w-4.5 h-4.5" />
      </div>
    </div>
  );
}
