"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/feature/slice/auth/authSlice";
import { useGetNotificationCountQuery } from "@/feature/slice/notifications/notificationSlice";
import { onboardingReset } from "@/feature/slice/onboarding/onboardingSlice";
import { useGetUserProfileQuery } from "@/feature/slice/user/userSlice";
import { clearToken } from "@/lib/token";
import emptyImage from "@/public/empty_user.jpg";
import {
  LogoutIcon,
  MessageIcon,
  NotificationIcon,
  SettingIcon,
  UserCircleIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch } from "react-redux";

function UserHeaderInfo() {
  const { data: userProfileData } = useGetUserProfileQuery("user");
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userProfileData?.success) {
      dispatch(onboardingReset());
    }
  }, [userProfileData?.success, dispatch]);

  const router = useRouter();
  const { data: notificationCountData } =
    useGetNotificationCountQuery("notificationCount");
  const handleLogout = async () => {
    // Clear the access token cookie
    try {
      await logout();
      await clearToken();
      router.push("/login");
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
    // Redirect to the login page
  };

  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-6 justify-end w-full">
        <div className="flex items-center gap-4 lg:gap-5 justify-between">
          <Link
            href={`/mu/notification`}
            className="relative flex justify-center items-center "
          >
            {notificationCountData?.data?.unread_count > 0 && (
              <span className="absolute -top-2 -right-2 flex justify-center items-center text-[0.625rem] w-4 h-4 text-whiteColor rounded-full bg-redColor">
                {notificationCountData?.data?.unread_count > 99
                  ? "99+"
                  : notificationCountData?.data?.unread_count}
              </span>
            )}
            <NotificationIcon className="text-grayColor1" />
          </Link>
          <Link
            href={`/mu/message`}
            className="flex justify-center items-center"
          >
            <MessageIcon className="text-grayColor1" />
          </Link>

          <div className="  relative sm:ml-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="flex gap-2 h-full items-end">
                  <div className="flex items-center  rounded-full cursor-pointer hover:opacity-90">
                    <div className=" w-7 h-7 lg:w-12 border border-primaryColor lg:h-12 rounded-full overflow-hidden">
                      <Image
                        src={
                          userProfileData?.user?.profile_image_url || emptyImage
                        }
                        alt="Admin Avatar"
                        width={80}
                        height={80}
                        unoptimized
                        className="rounded-full w-full object-cover h-full"
                      />
                    </div>
                  </div>

                  <button className=" cursor-pointer">
                    <IoIosArrowDown size={16} className="text-blackColor" />
                  </button>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-50.5 p-3">
                <div className="">
                  <div className="flex items-center gap-2 pb-3 border-b border-borderColor">
                    <div className=" w-10 h-10 rounded-md border overflow-hidden mb-2">
                      <Image
                        src={
                          userProfileData?.user?.profile_image_url || emptyImage
                        }
                        alt="Admin Avatar"
                        width={40}
                        height={40}
                        className="rounded-md w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-headerColor">
                        {userProfileData?.user?.first_name +
                          " " +
                          userProfileData?.user?.last_name || "Vin Intini"}
                      </p>
                      <p className="text-sm  text-grayColor1 line-clamp-1">
                        {userProfileData?.user?.title ||
                          "CEO & Founder, MindUnite"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/mu/profile`}
                      className="text-headerColor hover:font-semibold  rounded-sm items-center gap-2 group hover:bg-bgLightColor flex  w-full  py-1.5 px-2 cursor-pointer"
                    >
                      <UserCircleIcon className="w-5 h-5 text-grayColor1" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href={`/mu/profile`}
                      className="text-headerColor hover:font-semibold  rounded-sm items-center gap-2 group hover:bg-bgLightColor flex  w-full  py-1.5 px-2 cursor-pointer"
                    >
                      <SettingIcon className="w-5 h-5 text-grayColor1  " />
                      Account Setting
                    </Link>
                  </DropdownMenuItem>
                </div>
                <div className="pt-3  border-t border-borderColor">
                  <button
                    onClick={handleLogout}
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
