"use client"
import { useGetTermsAndConditionsQuery } from '@/feature/slice/aboutUs/aboutUs';
import React from 'react'

export default function TermsConditon() {
    const { data, isLoading, isError } = useGetTermsAndConditionsQuery({});

    if (isError) {
        return <div>
            error
        </div>
    }
    const terms = data?.data;
    console.log(terms, "terms")
    return (
        <div className='  py-8 md:py-12 lg:py-15'>
            <h1 className='text-center items-center font-semibold text-2xl text-primaryColor'>{terms?.title}</h1>
            <div>
                <div dangerouslySetInnerHTML={{ __html: terms?.content || '' }} />
            </div>

        </div>
    )
}
