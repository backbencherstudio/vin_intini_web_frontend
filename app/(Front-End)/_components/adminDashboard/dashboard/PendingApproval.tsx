"use client";

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import type { PendingApprovalItem } from '@/feature/slice/admin/dashboard/adminDashboardApi';

interface PendingApprovalProps {
    data?: PendingApprovalItem[];
    isLoading?: boolean;
}

const defaultPending: PendingApprovalItem[] = [
    {
        title: "Products Pending",
        count: 11,
        link: "/dashboard/psychology/biotechnology"
    },
    {
        title: "Jobs Pending",
        count: 13,
        link: "/dashboard/academia/facilities"
    },
    {
        title: "Advertisements Pending",
        count: 35,
        link: "/dashboard/advertisement"
    },
    {
        title: "Reports",
        count: 17,
        link: "/dashboard/institution-reports"
    }
];

export default function PendingApproval({
    data = defaultPending,
    isLoading = false
}: PendingApprovalProps) {
    const items = data && data.length > 0 ? data : defaultPending;

    return (
        <div className='flex flex-col h-full'>
            <div className='border border-gray-100 shadow-sm p-4 rounded-2xl w-full h-full flex flex-col justify-between bg-white'>
                <p className="text-headerColor text-[18px] font-semibold leading-[160%] pb-3">Pending Approval</p>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 h-full'>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className='px-4 pt-4 pb-3 border border-[#E5E7EB] rounded-xl flex flex-col justify-between bg-white hover:border-primaryColor/40 transition-colors'
                        >
                            <div>
                                <p className="text-[#777980] text-[14px] font-normal leading-[140%] tracking-[0.07px]">{item.title}</p>
                                <p className="text-headerColor text-[24px] font-semibold leading-[130%] tracking-[0.12px] py-2">
                                    {isLoading ? '...' : Number(item.count).toLocaleString()}
                                </p>
                            </div>
                            <Link
                                href={item.link || '#'}
                                className="text-primaryColor flex justify-center items-center bg-[#E9FAF7] hover:bg-[#d8f6f1] w-full py-2 rounded-lg text-[14px] font-semibold leading-[140%] tracking-[0.07px] mt-auto transition-colors"
                            >
                                View Details <ArrowRight className='w-4 h-4 ml-1.5' />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
