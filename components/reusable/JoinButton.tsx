"use client"

import { RightArrowIcon } from "@/public/svgIcons/Icons";
import { useRouter } from "next/navigation";

type PropType = {
    title: string;
    redirectUrl?: string;
}

export default function JoinButton({ title, redirectUrl }: PropType) {
    const router = useRouter();
    const handleClick = () => {
        if(redirectUrl){
            router.push(redirectUrl);
        }

    }
    return (
        <button onClick={handleClick} type="button" className="w-fit flex items-center px-3 sm:px-6 md:px-3 lg:px-6 py-1.5 sm:py-3 md:py-1.5 lg:py-3 gap-1.5 sm:gap-3 rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-xl bg-primaryColor border border-primaryColor hover:bg-primaryColor/90 hover:rounded transition-all duration-300 cursor-pointer">
            <span className="text-xs sm:text-base md:text-sm lg:text-lg font-semibold leading-[160%] text-white">{title}</span>
            <RightArrowIcon className="w-4 sm:w-6 md:w-5 lg:w-6 h-4 sm:h-6 md:h-5 lg:h-6 text-white animate-bounce-x" />
        </button>
    )
}