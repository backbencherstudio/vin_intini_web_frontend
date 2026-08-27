"use client";

import { useState } from "react";
import {
  Monitor,
  MoreHorizontal,
} from "lucide-react";
import { useGetActiveSessionsQuery } from "@/feature/slice/admin/securitySettings";

interface Session {
  id: number;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current?: boolean;
}

const initialSessions: Session[] = [
  {
    id: 1,
    device: "MacBook Pro 15-inch",
    location: "Melbourne, Australia",
    ip: "192.168.32.1",
    lastActive: "10:40am",
    current: true,
  },
  {
    id: 2,
    device: "MacBook Pro 15-inch",
    location: "Dhaka, Bangladesh",
    ip: "192.168.32.1",
    lastActive: "10:40am",
    current: false,

  },
  {
    id: 3,
    device: "MacBook Pro 15-inch",
    location: "Dhaka, Bangladesh",
    ip: "192.168.32.1",
    lastActive: "10:40am",
    current: false,

  },
  {
    id: 4,
    device: "MacBook Pro 15-inch",
    location: "Dhaka, Bangladesh",
    ip: "192.168.32.1",
    lastActive: "10:40am",
    current: false,
  },
];

export default function ActiveSessions() {
  const [sessions, setSessions] = useState(initialSessions);
  const {data, isLoading , error} = useGetActiveSessionsQuery({});
  const ActiveSession = data?.data || [];
  console.log(ActiveSession);

  const removeSession = (id: number) => {
    setSessions((prev) =>
      prev.filter((session) => session.id !== id)
    );
  };

  const logoutAllSessions = () => {
    setSessions((prev) =>
      prev.filter((session) => session.current)
    );
  };

  return (
    <section className="rounded-md border border-[#E8E8E8]  p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-headerColor  text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
            Active Session
          </h2>

          <p className=" mt-2  text-sm font-normal leading-[150%] tracking-[0.08px] text-[#4A4C56]">
            Manage devices that are currently signed in to your account.
          </p>
        </div>

        <button
          type="button"
          className="text-[#04A1B7] text-[14px] whitespace-nowrap font-semibold leading-[140%] tracking-[0.07px] cursor-pointer
"
        >
          See All
        </button>
      </div>

      <div className="space-y-3">
        {ActiveSession.map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-3   pb-3 last:border-0"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center ">
              <Monitor
                size={24}
                className="text-black"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-black text-[16px] font-semibold leading-[150%] tracking-[0.08px]
">
                  {session.device}
                </p>

            
              </div>

              <p className="mt-1 text-[#7B7B7B] text-[14px] font-normal leading-[140%] tracking-[0.07px]
">
                {session.location} • {session.ip_address} •{" "}
                {session.login_at}
              </p>
            </div>
                <div className="flex items-center gap-2 justify-end">
                   {session?.is_current && (
                  <span className="rounded-full border border-[#287F6E] px-2 py-1 text-[#287F6E] text-center text-[12px] font-semibold leading-[132%] tracking-[0.06px]
">
                    Active now
                  </span>
                )}

                 <button
              type="button"
              onClick={() => removeSession(session.id)}
              disabled={session.current}
              className="text-[#888] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <MoreHorizontal size={17} className="text-[#000]" />
            </button>
                </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={logoutAllSessions}
        className="mt-4 w-full rounded-md border border-[#F3B5B5] bg-[#FFE1E1] py-2 cursor-pointer text-[#EB3D4D] text-center text-[14px] font-semibold leading-[140%] tracking-[0.07px]
 hover:bg-[#ffd5d5]"
      >
        Sign out all the sessions
      </button>
    </section>
  );
}