import Link from 'next/link';
import React from 'react';
import { FaGlobeAmericas } from "react-icons/fa";


type MapPopupProps = {
    name: string;
    psychologyDegrees?: string[];
    counselingDegrees?: string[];
    neuroscienceDegrees?: string[];
    address?: string;
    phone?: string;
    website?: string;
};

const MapPopup = ({ name, psychologyDegrees, counselingDegrees, neuroscienceDegrees, address, phone, website }: MapPopupProps) => {
    return (
        <div className="text-[13px] leading-relaxed p-2 text-gray-800 min-w-[220px]">
            <div>
                <div>
                    <label className='text-gray-500 text-[11px]'>name</label>
                    {website ? (
                        <Link href={website} className='flex items-center gap-1.5' target="_blank" rel="noopener noreferrer">
                            <FaGlobeAmericas />
                            <h2 className='text-blackColor font-medium text-sm hover:text-blue-500 transition-colors duration-300'>{name}</h2>
                        </Link>
                    ) : (
                        <h2 className='text-blackColor font-medium text-sm'>{name}</h2>
                    )}
                </div>
                {psychologyDegrees || counselingDegrees || neuroscienceDegrees ? (
                    <div className="">
                        <label className='text-gray-500 text-[11px]'>degrees</label>
                        {psychologyDegrees && psychologyDegrees.length > 0 && (
                            <h3 className='text-blackColor font-medium text-[11px]'>{psychologyDegrees.join(', ')} in Psychology</h3>
                        )}
                        {counselingDegrees && counselingDegrees.length > 0 && (
                            <h3 className='text-blackColor font-medium text-[11px]'>{counselingDegrees.join(', ')} in Counseling</h3>

                        )}
                        {neuroscienceDegrees && neuroscienceDegrees.length > 0 && (
                            <h3 className='text-blackColor font-medium text-[11px]'>{neuroscienceDegrees.join(', ')} in Neuroscience</h3>

                        )}
                    </div>) : (
                    <div>
                        <label className='text-gray-500 text-[11px]'>degrees</label>
                        <h3 className='text-blackColor font-medium text-[11px]'>No specific degrees listed</h3>
                    </div>
                )}
            </div>
            {/* <hr className='my-1' />
            <div>
                <div>
                    <label className='text-gray-500 text-[11px]'>address</label>
                    {address ? <h2 className='text-blackColor font-medium text-[11px]'>{address}</h2>

                        : <h2 className='text-blackColor font-medium text-[11px]'>No address listed</h2>}
                </div>
                <div>
                    <label className='text-gray-500 text-[11px]'>phone</label>
                    {phone ? <h2 className='text-blackColor font-medium text-[11px]'>{phone}</h2>
                        : <h2 className='text-blackColor font-medium text-[11px]'>No phone listed</h2>}
                </div>
            </div> */}
        </div>
    );
};

export default MapPopup;