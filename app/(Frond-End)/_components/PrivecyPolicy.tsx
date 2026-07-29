"use client"
import { useGetPrivecyPolicyQuery } from '@/feature/slice/aboutUs/aboutUs'
import React from 'react'

export default function PrivecyPolicy() {
    const { data, isLoading, isError, error } = useGetPrivecyPolicyQuery({})



    if (isError) {
        return <div>Error loading privacy policy</div>
    }

    // data structure: { success: true, data: { title, content } }
    const policy = data?.data

    return (
        <div className="privacy-policy  py-8 md:py-12 lg:py-15">
            <h1 className='text-center items-center font-semibold text-2xl text-primaryColor'>{policy?.title}</h1>
            {/* Render the HTML content safely */}
            <div
                dangerouslySetInnerHTML={{ __html: policy?.content || '' }}
            />
        </div>
    )
}