import { AboutGroupIcon, AboutStar } from '@/public/svgIcons/Icons'
import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function page() {
    return (
        <div className=''>
            <div className='pt-8 md:pt-12 lg:pt-[120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 '>
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#D6F1F8] px-4 py-1.5 uppercase text-base font-semibold leading-[150%] tracking-[0.08px] text-primaryColor">
                        <AboutStar className="h-[18px] w-[18px]" />
                        <span className='uppercase text-base font-semibold leading-[150%] font-["Segoe UI"]'>About Us</span>
                    </div>
                    <div className='py-4'>
                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-semibold leading-[130%] ">
                            Uniting Minds.

                        </div>
                        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-semibold leading-[130%] text-primaryColor">
                            Advancing Brain Health.
                        </div>
                    </div>
                    <p className="text-base sm:text-lg md:text-xl lg:text-[18px] font-normal leading-[160%] mb-4 md:mb-8">
                        Mind Unite is a global networking platform for brain health professionals, students. and industry partners
                        to connect. collaborate. and create impact together</p>

                    <button className='text-whiteColor bg-primaryColor rounded-[12px] text-lg font-semibold leading-[160%] tracking-[0.08px] px-6 py-2 flex items-center gap-3 cursor-pointer'>Explore Features  <MoveRight className='text-white flex items-center justify-center my-auto' /></button>
                </div>

                <div className='relative'>
                    <div className='rounded-full overflow-hidden'>
                        <Image src="/images/aboutUs/SVG.svg" alt="About Group" width={500} height={500} />
                    </div>
                    {/* <div className='absolute top-[-12px] right-0 z-1'>
                        <AboutGroupIcon />
                    </div> */}
                </div>
            </div>
        </div>
    )
}
