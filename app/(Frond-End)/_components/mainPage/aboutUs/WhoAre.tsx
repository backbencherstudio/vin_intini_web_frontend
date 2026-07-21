import { MonitorsIcon, OurVisionIcon, StrategyIcon } from '@/public/svgIcons/Icons';
import React from 'react'

export default function WhoAre() {
    const visionMissionStrategy = [
        {
            id: 1,
            title: "Our Vision",
            description:
                "Empowering researchers, academia, and industry professionals through meaningful knowledge sharing and networking.",
            cardBg: "#E2FBFF",
            iconBg: "#BCF3FB",
            icon: OurVisionIcon,
        },
        {
            id: 2,
            title: "Our Mission",
            description:
                "To become the world's leading collaborative platform for neuroscience, connecting experts and improving healthcare through innovation.",
            cardBg: "#E4EEFF",
            iconBg: "#CEDEFC",
            icon: MonitorsIcon,
        },
        {
            id: 3,
            title: "Our Strategy",
            description:
                "Advance neuroscience research by fostering collaboration within a unified ecosystem designed to improve global health.",
            cardBg: "#F8F2FF",
            iconBg: "#E9DDF6",
            icon: StrategyIcon,
        },
    ];
    return (
        <div className=''>
            <div className='py-8 md:py-12 lg:py-25'>
                <div>
                    <h3 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold leading-[130%] tracking-[-0.96px] text-[#0B0B0B]">Who We Are?</h3>
                    <p className="text-center text-base sm:text-[17px] lg:text-lg font-normal leading-[160%] tracking-[-0.5px] text-[#404040] mt-3">Everything you need to build your career in the mind sciences, all in one platform.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-8'>
                    {visionMissionStrategy.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-lg p-6"
                            style={{ backgroundColor: item.cardBg }}
                        >
                            <div
                                className="mb-4.5 flex h-14 w-14 p-3 items-center justify-center rounded-lg"
                                style={{ backgroundColor: item.iconBg }}
                            >
                                <item.icon />
                            </div>

                            <h3 className="text-2xl font-medium leading-[130%] tracking-[0.12px] text-[#0B0B0B]">
                                {item.title}
                            </h3>

                            <p className="mt-3 text-sm font-normal leading-[140%] tracking-[0.07px] text-[#404040]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>


        </div>
    )
}
