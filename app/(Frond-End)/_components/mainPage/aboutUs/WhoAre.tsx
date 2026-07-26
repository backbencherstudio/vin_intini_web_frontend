"use client"

import React from 'react'
import Image from 'next/image'

import { useGetAboutUsQuery } from '@/feature/slice/aboutUs/aboutUs';
import { MonitorsIcon, OurVisionIcon, StrategyIcon } from '@/public/svgIcons/Icons';

export default function WhoAre() {
    const { data, error, isLoading } = useGetAboutUsQuery({});

    const aboutUs = data?.data?.founder || [];
    const vedio = data?.data?.core_values || [];


    const visionMissionStrategy = [
        {
            id: 1,
            title: "Our Vision",
            description: vedio?.vision,
            cardBg: "#E2FBFF",
            iconBg: "#BCF3FB",
            icon: OurVisionIcon,
        },
        {
            id: 2,
            title: "Our Mission",
            description: vedio?.mission,
            cardBg: "#E4EEFF",
            iconBg: "#CEDEFC",
            icon: MonitorsIcon,
        },
        {
            id: 3,
            title: "Our Strategy",
            description: vedio?.strategy,
            cardBg: "#F8F2FF",
            iconBg: "#E9DDF6",
            icon: StrategyIcon,
        },
    ];
    return (
        <div className='w-full py-0 md:py-12 lg:py-25'>
            <div className='container mx-auto px-4 md:px-6 lg:px-8'>

                <div className='grid grid-cols-1 md:grid-cols-12 gap-8 pb-4  items-center'>

                    <div className='flex col-span-9 md:col-span-4'>
                        <div className='relative w-full h-80 rounded-lg overflow-hidden'>
                            <Image
                                src={aboutUs.photo_url}
                                alt='Founder'
                                fill
                                className='object-contain'
                            />
                        </div>
                    </div>


                    <div className='flex flex-col justify-center col-span-8'>
                        <p className='text-sm font-semibold text-[#0B0B0B] mb-2'>Hello, I'm        <span className='text-3xl font-bold text-blue-500 mb-1'>{aboutUs.name}</span></p>

                        <p className='text-sm font-medium text-[#404040] mb-6'>{aboutUs.designation}</p>

                        <p className='text-sm font-normal leading-relaxed text-[#404040] mb-6'>
                            {aboutUs.bio}
                        </p>

                        <p className='text-sm font-normal leading-relaxed text-[#404040] mb-8'>
                            Together, we can build a stronger, smarter, and more connected global community.
                        </p>


                        <div className='text-2xl font-script text-[#404040] italic'>
                            Founder Signature
                        </div>
                    </div>
                </div>

                {/* Vision, Mission, Strategy Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 '>
                    {visionMissionStrategy.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl p-8"
                            style={{ backgroundColor: item.cardBg }}
                        >
                            <div
                                className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg"
                                style={{ backgroundColor: item.iconBg }}
                            >
                                <item.icon />
                            </div>

                            <h3 className="text-xl font-semibold leading-relaxed text-[#0B0B0B]">
                                {item.title}
                            </h3>

                            <p className="mt-4 text-sm font-normal leading-relaxed text-[#404040]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
