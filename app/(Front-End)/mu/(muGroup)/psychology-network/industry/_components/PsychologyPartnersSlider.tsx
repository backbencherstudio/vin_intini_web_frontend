"use client";

import { useGetAllPartnersQuery } from "@/feature/slice/biotechnologySlice";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface Partner {
  id: string | number;
  name?: string;
  partner_name?: string;
  title?: string;
  slug?: string;
  logo?: string;
  partner_logo?: string;
  image?: string;
  website?: string;
  website_url?: string;
  tagline?: string;
}

export default function PsychologyPartnersSlider() {
  const { data, isLoading } = useGetAllPartnersQuery();
  const partners: Partner[] = data?.partners || [];

  if (isLoading) {
    return (
      <div className="w-full mb-6 border-b border-borderColor h-[66px] pb-2 flex items-center">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12 w-full">
          <div className="w-full text-center md:col-span-5 md:text-left lg:col-span-4">
            <h3 className="text-lg sm:text-xl font-semibold leading-tight text-headerColor">
              Mind Unite Partners
            </h3>
          </div>
          <div className="w-full md:col-span-7 lg:col-span-8 flex items-center gap-2">
            <div className="h-[50px] w-[50px] rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-[50px] w-[50px] rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-[50px] w-[50px] rounded-lg bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-6 border-b border-borderColor h-[66px] pb-2 flex items-center overflow-hidden overflow-y-hidden scrollbar-hide">
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12 w-full">
        {/* Left Side: Header & Text */}
        <div className="w-full text-center md:col-span-5 md:text-left lg:col-span-4">
          <h3 className="text-lg sm:text-xl font-semibold leading-tight text-headerColor">
            Mind Unite Partners
          </h3>
        </div>

        {/* Right Side: Marquee Slider */}
        <div className="w-full overflow-hidden overflow-y-hidden scrollbar-hide md:col-span-7 lg:col-span-8 flex items-center [&_.rfm-marquee-container]:overflow-hidden [&_.rfm-marquee-container]:scrollbar-hide [&_.rfm-marquee]:overflow-hidden [&_.rfm-marquee]:scrollbar-hide">
          {partners.length > 0 ? (
            <Marquee
              gradient={true}
              gradientWidth={40}
              gradientColor="#fff"
              speed={45}
              pauseOnHover={true}
              className="flex items-center overflow-hidden overflow-y-hidden scrollbar-hide"
            >
              {partners.map((partner, index) => {
                const imageUrl =
                  partner?.logo ||
                  partner?.partner_logo ||
                  partner?.image ||
                  "/placeholder.png";
                const partnerName =
                  partner?.name ||
                  partner?.partner_name ||
                  partner?.title ||
                  `Partner ${index + 1}`;
                const websiteUrl = partner?.website_url || partner?.website;
                const targetUrl = websiteUrl || `/mu/industry/${partner?.id}`;
                const isExternal = Boolean(websiteUrl);

                return (
                  <a
                    key={partner.id || index}
                    href={targetUrl}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    title={`${partnerName}${websiteUrl ? ` • ${websiteUrl}` : ""}`}
                    className="group relative mx-2.5 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg bg-white p-0.5 overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={imageUrl}
                      alt={partnerName}
                      width={100}
                      height={100}
                      className="h-full w-full object-contain rounded-md transition-transform duration-200 group-hover:scale-110"
                      unoptimized
                    />
                  </a>
                );
              })}
            </Marquee>
          ) : (
            <p className="text-center text-sm text-gray-400">
              No partners found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
