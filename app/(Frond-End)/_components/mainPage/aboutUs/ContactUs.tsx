import React from 'react'
import Image from 'next/image'
import { Inbox, Mail } from 'lucide-react'

import coin1 from "../../../../../public/images/coins/coins1.png";
import coin2 from "../../../../../public/images/coins/coins2.png";
import coin3 from "../../../../../public/images/coins/coins3.png";
import coin4 from "../../../../../public/images/coins/coins4.png";
import coin5 from "../../../../../public/images/coins/coins5.png";
import coin6 from "../../../../../public/images/coins/coins6.png";
import coin7 from "../../../../../public/images/coins/coins7.png"
import ContactForm from '../../ContactForm';
import ReusableInput from '@/components/reusable/InputFiled/ReusableInput'
import ReusableTextarea from '@/components/reusable/InputFiled/TextAreaField';

const coinImages = [
    coin1,
    coin2,
    coin3,
    coin4,
    coin5,
    coin6,
    coin7,
];

export default function ContactUs() {
    return (
        <div className='py-8 md:py-14 lg:py-25 '>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 container'>
                <div className=''>
                    <h4 className='text-[#000] text-[32px] md:text-4xl lg:text-5xl font-semibold leading-normal text-center md:text-start'>Contact Us   </h4>
                    <p className='text-[#494949] text-xl font-normal leading-130% mt-2 max-w-[522px] '>We are committed to processing the information in order to contact you and talk about your project. </p>

                    <div className='py-3 md:py-6'>
                        <p className='text-[#777980] text-xl font-normal leading-normal flex gap-2 py-2.5'>
                            <span><Mail className='text-primaryColor my-auto mt-1' /> </span>  contact@mindunite.com
                        </p>
                    </div>

                    <p className="text-[#0B0B0B] text-base font-medium leading-6 tracking-[0.08px] mb-4">Trusted by Leading Institutions</p>

                    <div className=''>
                        <div className="flex flex-wrap gap-6">
                            {coinImages.map((coin, index) => (
                                <div
                                    key={index}
                                    className="flex h-12 w-12 items-center justify-center "
                                >
                                    <Image
                                        src={coin}
                                        alt={`Coin ${index + 1}`}
                                        width={60}
                                        height={60}
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='space-y-4 bg-[#FFFFFF] w-full'>
                    {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <ReusableInput id="name" label="Full Name*" className='rounded-xl' placeholder='Your full name' />
                        <ReusableInput id="Phone" label="Phone*" className='rounded-xl' placeholder='+1 0000 000 000' />
                        <ReusableInput id="email" label="Email*" className='rounded-xl' placeholder='Enter your email' />
                        <ReusableInput id="address" label="Address*" className='rounded-xl' placeholder='123 Main Street, City, Country' />
                    </div>
                    <ReusableInput id="subject" label="Subject*" className='rounded-xl' placeholder='Your subject' />
                    <ReusableTextarea id="message" label="Message*" className='rounded-xl h-[140px] px-2 py-3 border w-full' placeholder='Your message here...' />
                    <button className="w-full py-3 bg-[#04A1B7] rounded-xl text-white text-base font-medium">Send Message</button> */}

                    <ContactForm />
                </div>
            </div>
        </div>
    )
}
