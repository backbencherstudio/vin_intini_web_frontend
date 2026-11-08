"use client";

import Link from "next/link";
import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";
import type { StatusCardItem } from "@/feature/slice/admin/dashboard/adminDashboardApi";

interface StatusCardProps {
  data?: StatusCardItem[];
  isLoading?: boolean;
}

const defaultCardData: StatusCardItem[] = [
  {
    key: "total_users",
    title: "Total User",
    value: "45,875",
    raw_value: 45875,
    percentage: "59.2%",
    direction: "up",
    link: "/dashboard/user-management/basic-user",
  },
  {
    key: "total_jobs",
    title: "Total Job",
    value: "7,674",
    raw_value: 7674,
    percentage: "59.2%",
    direction: "up",
    link: "/dashboard/academia/facilities",
  },
  {
    key: "total_posts",
    title: "Total Post",
    value: "156",
    raw_value: 156,
    percentage: "59.2%",
    direction: "up",
    link: null,
  },
  {
    key: "total_ads",
    title: "Total Ads",
    value: "100",
    raw_value: 100,
    percentage: "59.2%",
    direction: "down",
    link: "/dashboard/advertisement",
  },
  {
    key: "total_publications",
    title: "Total Publications",
    value: "564",
    raw_value: 564,
    percentage: "59.2%",
    direction: "up",
    link: "/dashboard/publications",
  },
];

export default function StatusCard({
  data = defaultCardData,
  isLoading = false,
}: StatusCardProps) {
  const cards = data && data.length > 0 ? data : defaultCardData;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-white p-4 border border-gray-100 animate-pulse space-y-3"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((item, index) => {
          const isDown = item.direction === "down";
          const Icon = isDown ? IoIosTrendingDown : IoIosTrendingUp;

          const cardContent = (
            <div className="rounded-lg bg-white p-4 border border-gray-200 hover:border-gray-300 transition-all shadow-2xs h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-[#777980] text-[14px] font-normal leading-[19.6px] tracking-[0.07px]">
                  {item.title}
                </h3>
                <div>
                  <IoArrowForward className="text-[#777980] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              <p className="text-headerColor text-[32px] font-semibold leading-[130%] py-3">
                {item.value}
              </p>

              <div className="flex items-center gap-2.5">
                <div
                  className={`flex items-center gap-1 rounded-full ${
                    isDown ? "bg-[#FEECEE]" : "bg-[#E9FAF7]"
                  } px-2 py-0.5`}
                >
                  <Icon
                    size={16}
                    className={
                      isDown
                        ? "text-[#EB3D4D]"
                        : "text-primaryColor"
                    }
                  />
                  <span
                    className={
                      isDown
                        ? "text-[#EB3D4D] text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                        : "text-primaryColor text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                    }
                  >
                    {item.percentage}
                  </span>
                </div>

                <p className="text-[#777980] text-[12px] font-normal leading-[132%] tracking-[0.06px]">
                  VS previous month
                </p>
              </div>
            </div>
          );

          if (item.link) {
            return (
              <Link
                key={item.key || index}
                href={item.link}
                className="group block"
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <div key={item.key || index} className="group">
              {cardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
