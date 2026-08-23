"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Monitor,
  MoreHorizontal,
} from "lucide-react";

interface LoginActivityItem {
  id: number;
  device: string;
  browser: string;
  location: string;
  ip: string;
  date: string;
  time: string;
  status: "Successful" | "Failed";
}

const loginActivities: LoginActivityItem[] = [
  {
    id: 1,
    device: "Windows",
    browser: "Chrome",
    location: "Dhaka, Bangladesh",
    ip: "103.14.5.124",
    date: "09 Jul 2026",
    time: "12:40 AM",
    status: "Successful",
  },
  {
    id: 2,
    device: "Mac",
    browser: "Chrome",
    location: "Dhaka, Bangladesh",
    ip: "101.156.7.109",
    date: "07 Jul 2026",
    time: "11:56 AM",
    status: "Successful",
  },
  {
    id: 3,
    device: "Windows",
    browser: "Firefox",
    location: "Dhaka, Bangladesh",
    ip: "172.16.25.43",
    date: "15 Jul 2026",
    time: "06:42 PM",
    status: "Successful",
  },
  {
    id: 4,
    device: "Mac",
    browser: "Safari",
    location: "Dhaka, Bangladesh",
    ip: "203.21.15.43",
    date: "22 Jul 2026",
    time: "09:15 AM",
    status: "Successful",
  },
  {
    id: 5,
    device: "Linux",
    browser: "Chrome",
    location: "Dhaka, Bangladesh",
    ip: "203.0.113.7",
    date: "29 Jul 2026",
    time: "03:30 PM",
    status: "Successful",
  },
];

export default function LoginActivity() {
  const [page, setPage] = useState(1);

  const totalPages = 5;

  return (
    <section className="rounded-md border border-[#E8E8E8] bg-white p-4">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold text-[#121212]">
          Login Activity
        </h2>

        <p className="mt-1 text-[12px] text-[#8C8C8C]">
          Review your recent account login activity.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] border-collapse">
          <thead>
            <tr className="border-y border-[#EEEEEE] bg-[#FAFAFA]">
              <th className="px-3 py-3 text-left text-[10px] font-medium text-[#777]">
                No.
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-medium text-[#777]">
                Device / Browser
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-medium text-[#777]">
                Location
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-medium text-[#777]">
                IP Address
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-medium text-[#777]">
                Date & Time
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-medium text-[#777]">
                Status
              </th>

              <th className="px-3 py-3 text-left text-[10px] font-medium text-[#777]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loginActivities.map((activity) => (
              <tr
                key={activity.id}
                className="border-b border-[#F1F1F1] last:border-0"
              >
                <td className="px-3 py-3 text-[10px] text-[#777]">
                  {activity.id}
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Monitor
                      size={13}
                      className="text-[#555]"
                    />

                    <div>
                      <p className="text-[10px] font-medium text-[#333]">
                        {activity.device}
                      </p>

                      <p className="text-[9px] text-[#999]">
                        {activity.browser}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 text-[10px] text-[#555]">
                  {activity.location}
                </td>

                <td className="px-3 py-3 text-[10px] text-[#555]">
                  {activity.ip}
                </td>

                <td className="px-3 py-3">
                  <p className="text-[10px] text-[#555]">
                    {activity.date}
                  </p>

                  <p className="text-[9px] text-[#999]">
                    {activity.time}
                  </p>
                </td>

                <td className="px-3 py-3">
                  <span className="flex w-fit items-center gap-1 rounded-full border border-[#7ADCCF] bg-[#EFFFFD] px-2 py-1 text-[8px] text-[#04A1B7]">
                    <CheckCircle2 size={9} />

                    {activity.status}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <div className="flex gap-2 text-[#777]">
                    <button type="button">
                      <Eye size={13} />
                    </button>

                    <button type="button">
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[9px] text-[#999]">
          Showing 1 to 10 of 500 results
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              setPage((prev) => Math.max(1, prev - 1))
            }
            disabled={page === 1}
            className="flex h-7 w-7 items-center justify-center rounded border border-[#E5E5E5] text-[#777] disabled:opacity-30"
          >
            <ChevronLeft size={13} />
          </button>

          {[1, 2, 3, 4, 5].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPage(item)}
              className={`flex h-7 w-7 items-center justify-center rounded text-[9px] ${
                page === item
                  ? "bg-[#04A1B7] text-white"
                  : "border border-[#E5E5E5] text-[#777]"
              }`}
            >
              {item}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              setPage((prev) =>
                Math.min(totalPages, prev + 1)
              )
            }
            disabled={page === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded border border-[#E5E5E5] text-[#777] disabled:opacity-30"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}