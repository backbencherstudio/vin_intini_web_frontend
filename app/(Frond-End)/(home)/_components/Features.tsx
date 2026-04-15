import { RightArrowIcon } from "@/public/svgIcons/Icons";
import Image from "next/image";
import FeatureCard from "./FeatureCard";
import { landingPageFeatures } from "@/public/staticData";

export default function Features() {
    return (
        <div className="grid md:grid-cols-8 xl:grid-cols-7 gap-2.5 sm:gap-4 md:gap-2.5 xl:gap-4 container py-8! sm:py-12! md:py-16! lg:py-24! xl:py-[100px]! ">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-2.5 xl:gap-4 md:col-span-4">
                <div className="grid grid-rows-[1fr_auto] gap-8 justify-between p-6 md:p-4 xl:p-6 bg-primaryColor/10 rounded-2xl md:rounded-lg xl:rounded-2xl">
                    <div className="space-y-3">
                        <h2 className="text-primaryColor text-sm sm:text-base md:text-sm xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">Features</h2>
                        <h1 className="text-blackColor text-lg sm:text-3xl md:text-lg lg:text-3xl xl:text-5xl font-semibold leading-[130%] -tracking-[0.96px] max-w-[290px]">Why Choose Mind Unite?</h1>
                        <p className="text-[#404040] text-xs sm:text-base md:text-xs xl:text-sm font-normal leading-[160%] -tracking-[0.5px] max-w-[290px]">Everything you need to build your career in the mind sciences, all in one platform.</p>
                    </div>
                    <button type="button" className="w-fit flex items-center px-3 sm:px-6 md:px-3 lg:px-6 py-1.5 sm:py-3 md:py-1.5 lg:py-3 gap-1.5 sm:gap-3 rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-xl bg-primaryColor border border-primaryColor hover:bg-primaryColor/90 hover:rounded transition-all duration-300 cursor-pointer">
                        <span className="text-xs sm:text-base md:text-sm lg:text-lg font-semibold leading-[160%] text-white">Join Now</span>
                        <RightArrowIcon className="w-4 sm:w-6 md:w-5 lg:w-6 h-4 sm:h-6 md:h-5 lg:h-6 text-white animate-bounce-x" />
                    </button>
                </div>
                <div className="">
                    <Image
                        src="/images/feature-img.jpg"
                        alt="Feature Image"
                        width={500}
                        height={300}
                        className="w-full h-full object-cover rounded-2xl md:rounded-lg xl:rounded-2xl"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-2.5 xl:gap-4 md:col-span-4 xl:col-span-3">
                {landingPageFeatures?.map((feature, index) => (
                    <FeatureCard 
                        key={index}
                        data={feature}
                    />
                ))}
            </div>
        </div>
    )
}