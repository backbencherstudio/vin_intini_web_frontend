import React from 'react';

type Row = {
    label?: string;
    value?: string | React.ReactNode;
};


const MapPopup = () => {
    return (
        <div className="text-[13px] leading-relaxed text-gray-800 min-w-[220px]">
            <div>
                <div>
                    <label className='text-gray-500 text-[11px]'>name</label>
                    <h2 className='text-blackColor font-medium text-sm'>University of North Alabama</h2>
                </div>
                <div>
                    <label className='text-gray-500 text-[11px]'>description</label>
                    <h3 className='text-blackColor font-medium text-xs'>BS or BA in Psychology</h3>
                </div>
            </div>
            <hr className='my-1' />
            <div>
                <div>
                    <label className='text-gray-500 text-[11px]'>address</label>
                    <h2 className='text-blackColor font-medium text-xs'>University of North Alabama</h2>
                </div>
                <div>
                    <label className='text-gray-500 text-[11px]'>phone</label>
                    <h2 className='text-blackColor font-medium text-xs'>University of North Alabama</h2>
                </div>
            </div>
        </div>
    );
};

export default MapPopup;