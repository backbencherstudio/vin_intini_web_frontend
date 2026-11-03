"use client";

import Search from "@/components/reusable/Search";
import { useGetConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function ConnectionRequestHeader() {
  const { data } = useGetConnectionsQuery({
    query: `?page=${1}&limit=${10}`,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-3 min-h-[66px]">
        <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
          Connection Requests{" "}
          <span className="text-base font-normal text-grayColor1">
            ({data?.total || 0})
          </span>
        </h2>

        <div className="flex items-center gap-4">
          <div className="relative w-64 lg:w-72 hidden md:block max-w-full">
            <Search placeHolder="Search network & connection.." />
          </div>

          <Link
            href="/mu/my-network/connection-requests"
            className="inline-flex items-center gap-1 text-[15px] font-semibold text-headerColor hover:text-primaryColor transition-colors"
          >
            Show All
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="relative w-full md:hidden max-w-full">
          <Search placeHolder="Search network & connection.." />
        </div>
      </div>
    </div>
  );
}

export default ConnectionRequestHeader;
