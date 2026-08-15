import Breadcrumb from "@/components/reusable/dashboard/BreadCumb";
import Image from "next/image";
import { IoMdNotifications } from "react-icons/io";
import adminImg from "@/public/images/admin/profile.png";

export default function TopHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between border-b bg-white px-4 ">

            <div className="flex items-center gap-3">
                <Breadcrumb />
            </div>

            {/* Right side */}
            <div className="flex justify-center items-center gap-5 ">
                <IoMdNotifications className="h-4 w-4" />

                <div className="flex items-center gap-2">
                    <Image
                        src={adminImg}
                        alt="Admin Image"
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        priority
                    />
                    {/* <div>
                        <h4 className="text-[#1D1F2C] font-['Segoe_UI'] text-sm font-semibold leading-6 tracking-[0.08px]">{adminInfo?.name}</h4>
                        <p className="text-[#6B7280] font-['Segoe_UI'] text-xs font-normal leading-6 tracking-[0.08px]">{adminInfo?.email}</p>
                    </div> */}
                </div>
            </div>

        </header>
    );
}