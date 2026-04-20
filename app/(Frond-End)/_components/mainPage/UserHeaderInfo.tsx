import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationIcon } from "@/public/svgIcons/Icons";
import { X } from "lucide-react";
import Image from "next/image";
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
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              className="cursor-pointer relative flex justify-center items-center "
              onClick={() => setPopoverOpen(!popoverOpen)}
            >
              <span className="absolute -top-2 -right-2 flex justify-center items-center text-xs w-4 h-4 text-whiteColor rounded-full bg-redColor">
                2
              </span>
              <NotificationIcon />
            </PopoverTrigger>

            <PopoverContent className="w-70 md:w-[267px] mt-4 p-0 max-h-[500px] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <h4 className="text-base font-bold md:text-lg text-headerColor">
                  Notifications
                </h4>

                <button
                  onClick={() => setPopoverOpen(false)}
                  className="text-[#455468] bg-bgColor w-[35px] h-[35px] shadow-sm rounded-full cursor-pointer text-lg font-bold flex items-center justify-center"
                >
                  <X size={16} />
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
                <div className="flex gap-2 h-full items-end">
                  <div className="flex items-center  rounded-full cursor-pointer hover:opacity-90">
                    <div className=" w-7 h-7 lg:w-12 lg:h-12 rounded-md overflow-hidden">
                      <Image
                        src={"/profile.png"}
                        alt="Admin Avatar"
                        width={40}
                        height={40}
                        className="rounded-md w-full h-full"
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
                  className="text-redColor hover:bg-redColor/10 flex justify-center w-full hover:text-redColor hover:border hover:border-redColor font-semibold cursor-pointer"
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHeaderInfo;
