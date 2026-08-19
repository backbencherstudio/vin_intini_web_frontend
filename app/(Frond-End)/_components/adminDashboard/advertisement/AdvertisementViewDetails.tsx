import CustomBadge from '@/components/reusable/dashboard/CustomBadge'
import React from 'react'

export default function AdvertisementViewDetails({ job }: { job: any }) {

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='h-[258px] w-[226px] '>
                    {job?.advertisImage && (
                        <img className='h-[258px] object-center ' src={job.advertisImage} alt="Advertisement" />
                    )}
                </div>
                <div className="gap-y-2">
                    <h3>{job.advertiser}</h3>
                    <CustomBadge color={job.status === "Active" ? "green" : "red"} className='text-xs'>{job.status}</CustomBadge>
                    <p className="text-[#4A4C56] font-['Segoe_UI'] text-[14px] font-normal leading-[140%] tracking-[0.07px]">Industry: <span className='font-semibold text-xs'>{job.industry}</span></p>
                    <p className="text-[#4A4C56] font-['Segoe_UI'] text-[14px] font-normal leading-[140%] tracking-[0.07px]">Impression: <span className='font-semibold text-xs'>{job.impression}</span></p>
                    <p className="text-[#4A4C56] font-['Segoe_UI'] text-[14px] font-normal leading-[140%] tracking-[0.07px]">Clicks: <span className='font-semibold text-xs'>{job.clicks}</span></p>
                    <p className="text-[#4A4C56] font-['Segoe_UI'] text-[14px] font-normal leading-[140%] tracking-[0.07px]">CTR: <span className='font-semibold text-xs'>{job.ctr}</span></p>
                    <p className="text-[#4A4C56] font-['Segoe_UI'] text-[14px] font-normal leading-[140%] tracking-[0.07px]">Joined: <span className='font-semibold text-xs'>{job.joined}</span></p>
                </div>
            </div>
            <div className='border mt-8 rounded-xl'>
                <h4 className='p-4'>{job?.desc}</h4>
            </div>
        </div>
    )
}