"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { MdNotifications } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import emptyImage from "@/public/empty_user.jpg";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Search from "./Search";

interface HeaderProps {
  onNotificationClick?: () => void;
  adminName?: string;
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  sidebarOpen,
}: HeaderProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const router = useRouter();

  return (
    <nav className=" text-blackColor border-b bg-bgColor border-borderColor  py-3">
      <div className=" px-3  md:px-6   relative flex justify-between w-full mb-1 z-50">
        {/* Mobile menu button */}
        <div>
          <div className=" xl:hidden h-full flex items-center">
            <button
              onClick={onMenuClick}
              className=" pr-2 py-2  text-[#4A4C56]"
            >
              {sidebarOpen ? (
                <X className=" z-50 bg-black " />
              ) : (
                <Menu className="text-blackColor" />
              )}
            </button>
          </div>
        </div>

        {/* Notification and Profile Group */}
        <div className="flex items-center gap-2 lg:gap-6 justify-end w-full">
          <div className=" hidden md:block w-full ">
            <Search />
          </div>
          <div className="flex items-center gap-2 lg:gap-5 justify-between">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                className="cursor-pointer relative flex justify-center items-center "
                onClick={() => setPopoverOpen(!popoverOpen)}
              >
                <span className="absolute -top-1.5 -right-1.5 flex justify-center items-center text-xs w-4 h-4 text-whiteColor rounded-full bg-redColor">
                  2
                </span>

                <MdNotifications className="text-gray-700" size={24} />
              </PopoverTrigger>

              <PopoverContent className="w-70 md:w-66.75 mt-4 p-0 max-h-125 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                  <h4 className="text-base font-bold md:text-lg text-headerColor">
                    Notifications
                  </h4>

                  <button
                    onClick={() => setPopoverOpen(false)}
                    className="text-[#455468] bg-bgColor w-8.75 h-8.75 shadow-sm rounded-full cursor-pointer text-lg font-bold flex items-center justify-center"
                  >
                    <X className="" />
                  </button>
                </div>

                <div className="overflow-y-auto px-4 py-3 flex-1">
                  <p className="text-center text-sm text-gray-500 py-6">
                    No notifications available
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            <div className="  relative sm:ml-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex gap-3 h-full items-center">
                    <div
                      className="flex items-center  p-1  rounded-full cursor-pointer hover:opacity-90"
                      style={{
                        boxShadow: "2px 2px 7px 2px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className=" w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden">
                        <Image
                          src={emptyImage}
                          alt="Admin Avatar"
                          width={40}
                          height={40}
                          className="rounded-full w-full h-full"
                        />
                      </div>
                    </div>

                    <button className=" cursor-pointer">
                      <IoIosArrowDown size={16} className="text-blackColor" />
                    </button>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-4 py-2">
                    <p className="text-sm font-semibold text-headerColor">
                      {"User"}
                    </p>
                    <p className="text-xs text-textColor">
                      {"admin@company.com"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      router.push("/login");
                    }}
                    className="text-redColor hover:bg-redColor/10! flex justify-center w-full hover:text-redColor! hover:border hover:border-redColor font-semibold cursor-pointer"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <div className=" md:hidden px-4">
        <Search />
      </div>
    </nav>
  );
};

export default Header;
