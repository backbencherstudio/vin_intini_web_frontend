"use client";

import Search from "@/components/reusable/Search";
import { useGetConnectionsQuery } from "@/feature/slice/connect/connectSlice";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ConnectionRequestHeaderProps {
  activeTab?: "received" | "sent";
  onTabChange?: (tab: "received" | "sent") => void;
  sentCount?: number;
}

function ConnectionRequestHeader({
  activeTab = "received",
  onTabChange,
  sentCount = 0,
}: ConnectionRequestHeaderProps = {}) {
  const { data } = useGetConnectionsQuery({
    query: `?page=${1}&limit=${10}`,
  });

  const totalReceived = data?.total || 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderColor pb-3 min-h-[66px]">
        {onTabChange ? (
          <div className="inline-flex w-fit items-center gap-1">
            <button
              type="button"
              onClick={() => onTabChange("received")}
              className={`text-base font-medium pb-2 px-3 -mb-3 transition-all duration-200 cursor-pointer ${
                activeTab === "received"
                  ? "text-primaryColor border-b-2 border-primaryColor font-semibold"
                  : "text-descriptionColor hover:text-headerColor border-b-2 border-transparent"
              }`}
            >
              Received Requests{" "}
              <span className="text-sm font-normal text-grayColor1">
                ({totalReceived})
              </span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange("sent")}
              className={`text-base font-medium pb-2 px-3 -mb-3 transition-all duration-200 cursor-pointer ${
                activeTab === "sent"
                  ? "text-primaryColor border-b-2 border-primaryColor font-semibold"
                  : "text-descriptionColor hover:text-headerColor border-b-2 border-transparent"
              }`}
            >
              Sent Requests{" "}
              <span className="text-sm font-normal text-grayColor1">
                ({sentCount})
              </span>
            </button>
          </div>
        ) : (
          <h2 className="text-xl font-semibold leading-[120%] text-headerColor">
            Connection Requests{" "}
            <span className="text-base font-normal text-grayColor1">
              ({totalReceived})
            </span>
          </h2>
        )}

        <div className="flex items-center gap-4">
          <div className="relative w-64 lg:w-72 hidden md:block max-w-full">
            <Search placeHolder="Search network & connection.." />
          </div>

          {!onTabChange && (
            <Link
              href="/mu/my-network/connection-requests"
              className="inline-flex items-center gap-1 text-[15px] font-semibold text-headerColor hover:text-primaryColor transition-colors"
            >
              Show All
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className="relative w-full md:hidden max-w-full">
          <Search placeHolder="Search network & connection.." />
        </div>
      </div>
    </div>
  );
}

export default ConnectionRequestHeader;
