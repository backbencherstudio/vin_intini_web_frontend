"use client"

import React from 'react';

const MapSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] p-4">
      {/* Centered Title Bar Skeleton */}
      <div className="h-9 w-40 bg-gray-200 rounded-full mb-10 animate-pulse"></div>

      {/* Main Map Container */}
      <div className="relative w-full max-w-[960px] aspect-[959/593] bg-white rounded-[40px] shadow-[0_0_50px_rgba(186,215,255,0.3)] border border-blue-50 flex items-center justify-center overflow-hidden p-8 md:p-16">
        
        {/* The SVG Silhouette */}
        <svg 
          viewBox="0 0 959 593" 
          className="w-full h-full text-gray-100 fill-current animate-pulse"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Contiguous United States Silhouette (Mainland) */}
          <path d="M165,183 L245,141 L300,138 L355,143 L360,60 L465,68 L555,180 L610,145 L660,210 L685,210 L740,225 L825,190 L845,155 L860,100 L875,130 L900,175 L875,180 L840,225 L835,265 L830,300 L770,350 L760,415 L750,445 L690,450 L640,465 L625,470 L600,470 L585,365 L570,415 L500,400 L285,430 L255,310 L140,385 L70,365 L30,150 L95,165 Z" />
          
          {/* Alaska Placeholder (Simplified) */}
          <path d="M50,480 L170,480 L170,560 L50,560 Z" opacity="0.6" />
          
          {/* Hawaii Placeholders (Dots) */}
          <circle cx="280" cy="530" r="12" opacity="0.6" />
          <circle cx="310" cy="550" r="10" opacity="0.6" />
          <circle cx="340" cy="565" r="14" opacity="0.6" />
        </svg>

        {/* Shimmer Overlay: Moving light effect across the map */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-[20%] bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default MapSkeleton;