"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import {
  LogoutIcon,
  NotificationIcon,
  SettingIcon,
  UserCircleIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { useGetNotificationCountQuery } from "@/feature/slice/notifications/notificationSlice";

function UserHeaderInfo() {
  const { data, isLoading, isError } = useGetUserProfileQuery("user");

  const router = useRouter();
  const { data, isLoading, error } = useGetNotificationCountQuery("");
  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-6 justify-end w-full">
        <div className="flex items-center gap-4 lg:gap-5 justify-between">
          <Link
            href={`/mu/notification`}
            className="relative flex justify-center items-center "
          >
            {data?.data?.unread_count > 0 &&
              <span className="absolute -top-2 -right-2 flex justify-center items-center text-[0.625rem] w-4 h-4 text-whiteColor rounded-full bg-redColor">
                {data?.data.unread_count > 99 ? "99+" : data?.data.unread_count}
              </span>
            }
            <NotificationIcon />
          </Link>

          <div className="  relative sm:ml-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="flex gap-2 h-full items-end">
                  <div className="flex items-center  rounded-full cursor-pointer hover:opacity-90">
                    <div className=" w-7 h-7 lg:w-12 border border-primaryColor lg:h-12 rounded-full overflow-hidden">
                      <Image
                        src={data?.user?.profile_image_url || "/empty_user.jpg"}
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

              <DropdownMenuContent align="end" className="w-60.5 p-3">
                <div className="">
                  <div className="flex items-center gap-2 pb-3 border-b border-borderColor">
                    <div className=" w-10 h-10 rounded-md border overflow-hidden mb-2">
                      <Image
                        src={data?.user?.profile_image_url || "/empty_user.jpg"}
                        alt="Admin Avatar"
                        width={40}
                        height={40}
                        className="rounded-md w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-headerColor">
                        {data?.user?.first_name + " " + data?.user?.last_name ||
                          "Vin Intini"}
                      </p>
                      <p className="text-sm  text-grayColor1 line-clamp-1">
                        {data?.user?.title || "CEO & Founder, MindUnite"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-3 space-y-2">
                  <Link
                    href={`/mu/profile`}
                    className="text-headerColor hover:font-semibold  rounded-sm items-center gap-2 group hover:bg-bgLightColor flex  w-full  py-1.5 px-2 cursor-pointer"
                  >
                    <UserCircleIcon className="w-5 h-5 text-grayColor1" />
                    Profile
                  </Link>
                  <Link
                    href={`/mu/profile`}
                    className="text-headerColor hover:font-semibold  rounded-sm items-center gap-2 group hover:bg-bgLightColor flex  w-full  py-1.5 px-2 cursor-pointer"
                  >
                    <SettingIcon className="w-5 h-5 text-grayColor1  " />
                    Account Setting
                  </Link>
                </div>
                <div className="pt-3  border-t border-borderColor">
                  <button
                    onClick={() => {
                      router.push("/login");
                    }}
                    className="text-headerColor  items-center gap-2 group hover:bg-redColor/8 flex  w-full hover:text-redColor py-1 px-2 font-semibold cursor-pointer"
                  >
                    <LogoutIcon className="w-4 h-4 group-hover:text-redColor group-hover:fill-redColor" />
                    Log Out
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeaderInfo;
