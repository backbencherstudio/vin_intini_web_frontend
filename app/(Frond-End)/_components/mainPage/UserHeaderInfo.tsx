import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogoutIcon,
  NotificationIcon,
  SettingIcon,
  UserCircleIcon,
} from "@/public/svgIcons/Icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function UserHeaderInfo() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center gap-2 lg:gap-6 justify-end w-full">
        <div className="flex items-center gap-4 lg:gap-5 justify-between">
          <Link
            href={`/mu/notification`}
            className="relative flex justify-center items-center "
          >
            <span className="absolute -top-2 -right-2 flex justify-center items-center text-xs w-4 h-4 text-whiteColor rounded-full bg-redColor">
              2
            </span>
            <NotificationIcon />
          </Link>

          <div className="  relative sm:ml-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="flex gap-2 h-full items-end">
                  <div className="flex items-center  rounded-full cursor-pointer hover:opacity-90">
                    <div className=" w-7 h-7 lg:w-12 lg:h-12 rounded-full overflow-hidden">
                      <Image
                        src={"/empty_user.jpg"}
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
                    <div className=" w-10 h-10 rounded-md overflow-hidden mb-2">
                      <Image
                        src={"/empty_user.jpg"}
                        alt="Admin Avatar"
                        width={40}
                        height={40}
                        className="rounded-md w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-headerColor">
                        {"Vin Intini"}
                      </p>
                      <p className="text-sm  text-grayColor1 line-clamp-1">
                        {"CEO & Founder, MindUnite"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-3 space-y-2">
                  <Link
                    href={`/mu/1`}
                    className="text-headerColor hover:font-semibold  rounded-sm items-center gap-2 group hover:bg-bgLightColor flex  w-full  py-1.5 px-2 cursor-pointer"
                  >
                    <UserCircleIcon className="w-5 h-5 text-grayColor1" />
                    Profile
                  </Link>
                  <Link
                    href={`/mu/1`}
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
