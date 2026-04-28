"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search({ placeHolder }: { placeHolder?: string }) {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlValue =
      new URLSearchParams(window.location.search).get("search") || "";
    setSearch(urlValue);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      const nextQuery = params.toString();
      const currentQuery = window.location.search.replace(/^\?/, "");

      if (nextQuery === currentQuery) return;

      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}`, {
        scroll: false,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search, pathname, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="w-full  relative">
      <input
        type="text"
        name="search"
        value={search}
        onChange={handleChange}
        className="w-full text-sm  bg-whiteColor border border-gray2Color rounded-full py-2 px-4 pl-8 focus:outline-none focus:border-dark-500"
        placeholder={placeHolder || "Search Network"}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M12.5527 13.3269L7.58958 8.36354C7.17292 8.67979 6.71604 8.92472 6.21896 9.09833C5.72188 9.27194 5.20889 9.35875 4.68 9.35875C3.38153 9.35875 2.27688 8.9034 1.36604 7.99271C0.455347 7.08187 0 5.97743 0 4.67937C0 3.38132 0.455347 2.27688 1.36604 1.36604C2.27688 0.455347 3.38132 0 4.67937 0C5.97743 0 7.08187 0.455347 7.99271 1.36604C8.9034 2.27688 9.35875 3.38153 9.35875 4.68C9.35875 5.22486 9.26931 5.74583 9.09042 6.24292C8.91139 6.74014 8.6691 7.18903 8.36354 7.58958L13.3267 12.5527L12.5527 13.3269ZM4.67937 8.27563C5.68368 8.27563 6.5341 7.92729 7.23063 7.23062C7.92729 6.5341 8.27563 5.68368 8.27563 4.67937C8.27563 3.67507 7.92729 2.82465 7.23063 2.12812C6.5341 1.43146 5.68368 1.08312 4.67937 1.08312C3.67507 1.08312 2.82465 1.43146 2.12812 2.12812C1.43146 2.82465 1.08312 3.67507 1.08312 4.67937C1.08312 5.68368 1.43146 6.5341 2.12812 7.23062C2.82465 7.92729 3.67507 8.27563 4.67937 8.27563Z"
            fill="#777980"
          />
        </svg>
      </div>
    </div>
  );
}
