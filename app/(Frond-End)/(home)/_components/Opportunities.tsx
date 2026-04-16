import WrapperContainer from "../../_components/WrapperContainer";
import { ClockIcon, GraduationCapIcon, MapLocationIcon, SavedIcon } from "@/public/svgIcons/Icons";
import { opportunities } from "@/public/staticData";

export default function Opportunities() {
    return (
        <div className="bg-[#FAFBFC]">
            <WrapperContainer>
                <div className="space-y-12">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-primaryColor text-sm sm:text-base md:text-sm xl:text-xl font-semibold leading-[130%] tracking-[0.1px]">Opportunities</h2>
                            <h1 className="text-blackColor text-5xl font-semibold leading-[130%]">Explore <span className="text-primaryColor">Opportunities</span></h1>
                        </div>
                        <p className="text-[#404040] text-lg font-light leading-[160%]">Discover curated positions from leading institutions in psychology and neuroscience</p>
                    </div>
                    <div className="grid gap-6">
                        {opportunities.map((opportunity, index) => (
                            <div className="p-6 border border-[#D7F2F2] bg-white rounded-2xl">

                            </div>
                        ))}
                    </div>
                </div>
            </ WrapperContainer>
        </div>
    )
}